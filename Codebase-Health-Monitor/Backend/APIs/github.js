const { Octokit } = require("@octokit/rest");
require("dotenv").config();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const owner = "petericranston";

async function overview(chosenRepo) {
  try {
    const response = await octokit.rest.repos.get({
      //Gets the repo overview from the github REST API
      owner: owner,
      repo: chosenRepo,
    });

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

async function contributorData(chosenRepo) {
  try {
    const { repository } = await octokit.graphql(
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
      { owner, repo: chosenRepo },
    );

    const map = {};
    const timeline = {};

    for (const { author, additions, deletions, committedDate } of repository
      .defaultBranchRef.target.history.nodes) {
      const username = author?.user?.login; //Checking that there is a username
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

async function repoContent(chosenRepo) {
  try {
    const response = await octokit.rest.git.getTree({
      owner: owner,
      repo: chosenRepo,
      tree_sha: "main", // default branch name
      recursive: true, //Tells the api to return every file instead of just the top level contents (from the repo top folder)
    });

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

async function getRepos() {
  try {
    const response = await octokit.rest.repos.listForUser({
      //Getting data
      username: owner,
      sort: "updated",
    });

    return response.data.map((repo) => ({
      //Getting the repo names from the username
      name: repo.name,
    }));
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getFileContent(chosenRepo, filePath) {
  try {
    const response = await octokit.rest.repos.getContent({
      owner,
      repo: chosenRepo,
      path: filePath,
    });

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
