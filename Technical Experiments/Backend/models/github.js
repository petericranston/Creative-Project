const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({});

async function githubData() {
  const owner = "petericranston";
  const repo = "Bath-City-Farm-Project";

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
}
module.exports = {
  githubData,
};
