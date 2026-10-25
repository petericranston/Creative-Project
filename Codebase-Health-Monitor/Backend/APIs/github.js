const { Octokit } = require("@octokit/rest");
require("dotenv").config();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const cache = new Map(); //Stores github responses so repeat visits don't have to ask github again
const CACHE_TIME = 5 * 60 * 1000; //How long a response is kept for (5 minutes)

function cached(key, request) {
  //Runs a github request, or gives back the saved result if the same request was made in the last 5 minutes
  //key: a name for the request, e.g. "repo:username/reponame", so the same request always has the same key
  //request: a function that makes the github call (only run if there isn't a fresh saved result)
  key = key.toLowerCase(); //Github names aren't case sensitive
  const hit = cache.get(key); //Looking for a saved result for this request
  if (hit && Date.now() - hit.time < CACHE_TIME) return hit.promise; //Reusing the saved response if it's still fresh

  for (const [oldKey, entry] of cache) {
    if (Date.now() - entry.time >= CACHE_TIME) cache.delete(oldKey); //Clearing out expired responses so the cache doesn't keep growing
  }

  const promise = request(); //Saving the promise means requests made at the same time share one github call
  cache.set(key, { promise, time: Date.now() }); //Saving it with the time so we know when it goes out of date
  promise.catch(() => cache.delete(key)); //Failed requests aren't kept so they get retried next time
  return promise;
}

function getRepo(chosenRepo, username) {
  //Gets the repo details from the github REST API (shared by overview and repoContent)
  return cached(`repo:${username}/${chosenRepo}`, () =>
    octokit.rest.repos.get({ owner: username, repo: chosenRepo }),
  );
}

async function overview(chosenRepo, username) {
  try {
    const response = await getRepo(chosenRepo, username); //Gets the repo overview (cached)

    const repoData = response.data; //Setting data

    const overview = {
      //Organising data
      name: repoData.name,
      created_at: repoData.created_at,
      updated_at: repoData.updated_at,
      language: repoData.language,
    };

    return overview; //Returning the organised data
  } catch (error) {
    console.log(error);
  }
}

async function contributorData(chosenRepo, username) {
  try {
    const { repository } = await cached(
      //Commit history is cached so the github query only runs once every 5 minutes per repo
      `commits:${username}/${chosenRepo}`,
      () =>
        octokit.graphql(
          //Getting the data using graphQL (much more reliable than the github REST API Endpoints, essentially just asking for specific data and getting only that data)
          //Nested question
          `
      query($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          defaultBranchRef { 
            target {
              ... on Commit {
                history(first: 100) {
                  nodes {
                    author { user { login } }
                    additions
                    deletions
                    committedDate
                  }
                }
              }
            }
          }
        }
      }
    `,
          { owner: username, repo: chosenRepo },
        ),
    );

    const map = {};
    const timeline = {};

    for (const { author, additions, deletions, committedDate } of repository
      .defaultBranchRef.target.history.nodes) {
      const username = author?.user?.login; //Setting username if it exists
      if (!username) continue;

      const day = committedDate.slice(0, 10); //Organizing data into days

      //Sorting the commit data (addition and deletions of text as well)
      map[username] ??= { username, commits: 0, additions: 0, deletions: 0 };
      map[username].commits++;
      map[username].additions += Math.min(additions, 500); //Filtering out commits with more than 500 lines added (almost always bulk starting code which shouldn't be included)
      map[username].deletions += Math.min(deletions, 500);

      timeline[day] ??= {};
      timeline[day][username] = (timeline[day][username] ?? 0) + 1;
    }

    return {
      //Maping the data to be sent back to the server file and frontend
      contributors: Object.values(map),
      timeline: Object.keys(timeline)
        .sort()
        .map((day) => ({ day, ...timeline[day] })),
    };
  } catch (error) {
    console.log(error);
    return { contributors: [], timeline: [] }; //If theres an error return an empty array
  }
}

async function repoContent(chosenRepo, username) {
  try {
    const repo = await getRepo(chosenRepo, username); //Looking up the repo's default branch rather than assuming it's main

    //Getting the list of files on the default branch (cached)
    const response = await cached(`tree:${username}/${chosenRepo}`, () =>
      octokit.rest.git.getTree({
        owner: username,
        repo: chosenRepo,
        tree_sha: repo.data.default_branch, // default branch name
        recursive: true, //Tells the api to return every file instead of just the top level contents (from the repo top folder)
      }),
    );

    const files = response.data.tree
      .filter((item) => item.type === "blob") // removes folders and keeps only actual files
      .map((file) => ({
        name: file.path.split("/").pop(),
        path: file.path,
      }));
    return files;
  } catch (error) {
    console.log(error);
  }
}

async function getRepos(username) {
  //Getting the repos based on the username given
  try {
    //Getting the user's repo list (cached)
    const response = await cached(`repos:${username}`, () =>
      octokit.rest.repos.listForUser({
        //Getting data
        username: username,
        sort: "updated",
      }),
    );

    return response.data.map((repo) => ({
      //Getting the repo names from the username
      name: repo.name,
    }));
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getFileContent(chosenRepo, filePath, username) {
  //Getting file content for AI analysis
  try {
    const response = await cached(
      //Getting the file's contents (cached, so analysing the same file again doesn't ask github again)
      `file:${username}/${chosenRepo}/${filePath}`,
      () =>
        octokit.rest.repos.getContent({
          owner: username,
          repo: chosenRepo,
          path: filePath,
        }),
    );

    //Decodes from base64 sent from github
    return Buffer.from(response.data.content, "base64").toString("utf8");
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports = {
  overview,
  contributorData,
  repoContent,
  getRepos,
  getFileContent,
};
