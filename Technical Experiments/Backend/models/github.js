const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({});
const owner = "petericranston";
const repo = "Bath-City-Farm-Project";

async function overview() {
  try {
    const response = await octokit.rest.repos.get({
      //Gets the repo overview from the github REST API
      owner: owner,
      repo: repo,
    });

    const repoData = response.data;

    const overview = {
      name: repoData.name,
      created_at: repoData.created_at,
      updated_at: repoData.updated_at,
      language: repoData.language,
    };

    return overview;
  } catch (error) {
    console.log(error);
  }
}

async function contributorData() {
  try {
    const response = await octokit.rest.repos.listContributors({
      //Gets the contributor data from the github REST API
      owner: owner,
      repo: repo,
    });

    const contributors = response.data.map((user) => ({
      //Organises the contributor data
      username: user.login,
      commits: user.contributions,
    }));
    return contributors;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  overview,
  contributorData,
};
