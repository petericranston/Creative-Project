const { Octokit } = require("@octokit/rest");
const express = require("express");
require("dotenv").config();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

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
    const response = await octokit.rest.repos.getContributorsStats({
      //Gets the contributor data from the github REST API
      owner: owner,
      repo: repo,
    });
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
      username: owner,
      sort: "updated",
    });

    return response.data.map((repo) => ({
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
