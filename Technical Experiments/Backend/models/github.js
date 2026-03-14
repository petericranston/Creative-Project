import { Octokit } from "octokit";
const octokit = new Octokit({
  auth: "YOUR-TOKEN",
});

async function githubData() {
  return 10;
}

module.exports = {
  githubData,
};
