const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config(); //Configuring my .env for secret keys (mongodb)

const Anthropic = require("@anthropic-ai/sdk");
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const app = express();
const github = require("./APIs/github");
const analysis = require("./Models/analysis");

app.use(express.json());

app.use(
  cors({
    origin: "https://frontend-production-8627.up.railway.app",
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
  username = request.query.username;
  console.log("overview called with repo:", chosenRepo);

  try {
    const data = await github.overview(chosenRepo, username); //Getting the data from the github model
    response.json(data); //Sending data to frontend
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/contributors", async (request, response) => {
  chosenRepo = request.query.repo;
  username = request.query.username;
  console.log("contributors called with repo:", chosenRepo);

  try {
    const data = await github.contributorData(chosenRepo, username); //Getting the data from the github model
    const overviewData = await github.overview(chosenRepo, username);

    const totalCommits = data.contributors.reduce(
      (sum, u) => sum + u.commits,
      0,
    ); //Calculating the total commits in the repo

    const result = analysis.calculateDominance(data.contributors, totalCommits); //Calling function that calculates the dominance detection
    const healthScore = analysis.calculateHealthScore(
      data.contributors,
      data.timeline,
      overviewData.updated_at,
    );

    console.log(totalCommits); //Logging total commits
    console.log("Dominance Result: ", result); //Logging dominance results
    response.json({
      contributors: result,
      timeline: data.timeline,
      healthScore: healthScore,
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/filesContent", async (request, response) => {
  chosenRepo = request.query.repo;
  username = request.query.username;

  try {
    const data = await github.repoContent(chosenRepo, username); //Getting the data from the github model
    response.json(data); //Sending data to frontend
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/getRepos", async (request, response) => {
  username = request.query.username;
  try {
    const data = await github.getRepos(username); //Getting the data from the github model
    response.json(data); //Sending data to frontend
    console.log(data);
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/analyseFile", async (request, response) => {
  //File analysis
  //Retrieving data
  chosenRepo = request.query.repo;
  username = request.query.username;
  path = request.query.path;

  try {
    const fileContent = await github.getFileContent(chosenRepo, path, username); //Getting file content from github

    const message = await anthropic.messages.create({
      //Sending file content to Anthropic API (claude)
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Here is a file that I would like you to analyze\n\n${fileContent}. Please only provide me with exactly what I ask for and no more.
          Provide 3 main headings for the analysis. 
          The first of which will be the overall score of the file on a scale of 0-100, where:
          - 0-40: poor quality, many errors or bad practices
          - 41-70: average quality, some issues but functional
          - 71-85: good quality, minor issues only
          - 86-100: excellent quality, clean and well structured code
          Be strict and accurate with your scoring, do not default to a middle score. Please give a short explanation of why it is this score, 
          no more than a few sentences (in the conclusion section). For the second heading I would also like a small deepdive into some of the issue with the file, whether thats errors that
          might occur or code imperfections etc. I want the response to be clear but not excessive. Do not reference any line numbers. And for the third heading
          I would like you to provide an overall analysis of the file, things that are good and bad. Please provide this in readable paragraphs,
           not a "code response" but something someone will read and understand even if they didn't know how to code. Make it look as legible and
           clean for the user as possible. Please return the data in this json format and do not wrap it in markdown code blocks:: 
           {
            "overallScore": <number between 0 and 100>,
            "deepDive": "<detailed analysis of the code>",
            "conclusion": "<brief summary and key recommendations>"
          }
           `,
        },
      ],
    });

    try {
      //Retrieving data and making it parseable
      const raw = message.content[0].text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      const parsed = JSON.parse(raw);
      response.json({ analysis: parsed });
    } catch {
      response.json({
        //Sending raw content if theres a parsing error
        analysis: {
          overallScore: 0,
          deepDive: message.content[0].text,
          conclusion: "Could not parse response",
        },
      });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: "Analysis failed" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port http://localhost:3000/");
});
