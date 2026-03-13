const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config(); //Configuring my .env for secret keys (mongodb)

const app = express();

app.use(cors());
app.use(express.json());

const threeMinutes = 3 * 60 * 1000; //Variables to decide how long the user will be singed in for
const oneHour = 1 * 60 * 60 * 1000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
  //Starting a session to keep user signed in and store user data to use throughout the app
  sessions({
    secret: "No Secret Yet",
    cookie: { maxAge: oneHour },
    resave: false,
    saveUninitialized: false,
  }),
);

app.listen(3000, () => {
  console.log("Server running on port http://localhost:5173/");
});
