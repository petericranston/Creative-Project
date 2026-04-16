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
  const MAX_RETRIES = 10;
  const RETRY_DELAY_MS = 3000; // 3 seconds between retries

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await octokit.rest.repos.getContributorsStats({
        //Gets the contributor data from the github REST API
        owner: owner,
        repo: chosenRepo,
      });

      //This block checks if github has returned data and if so it continues and if not it tries again, this is to mitigate the common issue associated with this API endpoint
      if (response.status === 202) {
        if (attempt < MAX_RETRIES) {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        } else {
          return [];
        }
      }

      if (!response.data) return []; // handles GitHub delays

      const contributors = response.data.map((user) => ({
        //Organises the contributor data
        username: user.author.login,
        commits: user.total,
        additions: user.weeks.reduce((sum, w) => sum + w.a, 0),
        deletions: user.weeks.reduce((sum, w) => sum + w.d, 0),
      }));
      return contributors; //Returns contributor data
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}

async function repoContent() {
  try {
    const response = await octokit.rest.git.getTree({
      owner: owner,
      repo: repo,
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

module.exports = {
  overview,
  contributorData,
  repoContent,
  getRepos,
};
