const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(`${process.env.MONGO_URI}/FreeCodeCampAssignment4`);

// Models
const User = require("./Model/User");
const Exercise = require("./Model/Exercise");
const Log = require("./Model/Logs");
const bodyParser = require("body-parser");

app.post("/api/users", async (req, res) => {
  const { username } = req.body;
  const entry = await User.create({ username });
  return res.status(200).json(entry);
});

app.get("/api/users", async (req, res) => {
  const entry = await User.find({});
  return res.status(200).json(entry);
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  const _id = req.params._id;
  let { description, duration, date } = req.body;

  if (!date) {
    date = new Date();
  }

  const entry = await User.findOne({ _id });
  const e = {
    username: entry.username,
    description,
    duration,
    date,
  };

  const savedEntry = await Exercise.create(e);
  return savedEntry;
});

app.post("/api/users/:_id/logs", async (req, res) => {
  const _id = req.params._id;
  const entry = await User.findOne({ _id });
  const log = await Log.findOne({ username: entry.username }).select(
    "username count"
  );

  return res.status(200).json(log);
});

app.get("/api/users/:_id/logs", async (req, res) => {
  const _id = req.params._id;
  const entry = await User.findOne({ _id });
  const log = await Log.findOne({ username: entry.username }).select(
    "username log"
  );
  const arr = log.log;
  for (let i = 0; i < arr.length; i++) {
    const d = arr[i].date;
    const s = d.toString();
    arr[i].date = s;
  }

  log.log = arr;
  return res.status(200).json(log);
});



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
