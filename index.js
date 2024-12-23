import express from "express";
import path from "path";
import sqlite3 from "sqlite3";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { User } from "./db/models.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static("lib"));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// connect database
const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error(
      "There was a problem connecting to the databas:",
      err.message
    );
  } else {
    console.log("Connected with SQLite-database.");
  }
});

// routes
// main page
app.get("/", (req, res) => {
  res.render("auth", { title: "Registration for EcomPare" });
});

app.post("/signup", async (req, res) => {
  const { forename, surname, email, password } = req.body;

  // check if user typed the required fields
  if (!forename || !surname || !email || !password) {
    return res.status(400).send("All fields are required.");
  }

  try {
    // check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(409)
        .send("There already exists a user with this e-mail");
    }

    // create new user
    const newUser = await User.create({ forename, surname, email, password }); // password shoul be hashed
    res
      .status(201)
      .send(`User succesfully created: Welcome, ${newUser.forename}!`);
  } catch (error) {
    console.error(error);
    res.status(500).send("There was a problem signing you up.");
  }
});

app.post("/logIn", async (req, res) => {
  const { email, password } = req.body;

  // check if user typed required fields
  if (!email || !password) {
    return res.status(400).send("E-mail and password are required.");
  }

  try {
    // search for user in the database
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).send("It doesn't exist a user with this e-mail.");
    }

    // check if hashed password is correct
    if (user.password !== password) {
      return res.status(401).send("Wrong password.");
    }

    // user succesfully logged in
    res.send(`Welcome back, ${user.forename}!`);
  } catch (error) {
    console.error(error);
    res.status(500).send("There was a problem logging you in.");
  }
});

app.listen(3000);
