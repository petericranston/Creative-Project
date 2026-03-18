const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config(); //Configuring my .env for secret keys (mongodb)

const app = express();
const github = require("./APIs/github");

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
  try {
    const data = await github.overview(); //Getting the data from the github model
    response.json(data); //Sending data to frontend
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/contributors", async (request, response) => {
  try {
    const data = await github.contributorData(); //Getting the data from the github model
    response.json(data); //Sending data to frontend
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

app.listen(3000, () => {
  console.log("Server running on port http://localhost:3000/");
  github.contributorData().then(console.log);
  github.overview().then(console.log);
});
