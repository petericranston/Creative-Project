const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config(); //Configuring my .env for secret keys (mongodb)

const app = express();
const github = require("./APIs/github");
const analysis = require("./Models/analysis");

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.get("/", (request, response) => {
  response.send("Backend running");
});

// app.post("/api/getData", async (request, response) => {
//   response.json({ success: true });
// });

app.get("/api/overview", async (request, response) => {
  chosenRepo = request.query.repo;
  console.log("overview called with repo:", chosenRepo);

  try {
    const data = await github.overview(chosenRepo); //Getting the data from the github model
    response.json(data); //Sending data to frontend
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/contributors", async (request, response) => {
  chosenRepo = request.query.repo;
  console.log("contributors called with repo:", chosenRepo);

  try {
    const data = await github.contributorData(chosenRepo); //Getting the data from the github model
    const totalCommits = data.reduce((sum, u) => sum + u.commits, 0); //Calculating the total commits in the repo

    const result = analysis.calculateDominance(data, totalCommits); //Calling function that calculates the dominance detection
    console.log(totalCommits); //Logging total commits
    console.log("Dominance Result: ", result); //Logging dominance results
    response.json(result); //Sending results back to the frontend (includes dominance analysis)
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/filesContent", async (request, response) => {
  try {
    const data = await github.repoContent(); //Getting the data from the github model
    response.json(data); //Sending data to frontend
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/getRepos", async (request, response) => {
  try {
    const data = await github.getRepos(); //Getting the data from the github model
    response.json(data); //Sending data to frontend
    console.log(data);
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, () => {
  console.log("Server running on port http://localhost:3000/");
});
