const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan"); // ✅ ADD THIS

app.use(cors());
app.use(morgan("dev"));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(`${process.env.MONGO_URI}/FreeCodeCampAssignment4`);

// Models
const User = require("./Model/User");

app.post("/api/users", async (req, res) => {
  try {
    const { username } = req.body;
    const entry = await User.create({ username });
    return res.status(200).json(entry);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

app.get("/api/users", async (req, res) => {
  const entry = await User.find({}, "username _id");
  console.log(entry.username);
  return res.status(200).json(entry);
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  const _id = req.params._id;
  let { description, duration, date } = req.body;
  try {
    const user = await User.findById({ _id });
    if (!user) return res.status(404).json({ message: "User not found" });

    const e = {
      username: user.username,
      description,
      duration: parseInt(duration),
      date: date ? new Date(date) : new Date(),
    };
    user.log.push(e);
    await user.save();
    const temp = {
      username: user.username,
      description: e.description,
      duration: e.duration,
      date: e.date.toDateString(),
      _id: user._id,
    };
    console.log(date ? date : "###");
    console.log(temp);
    return res.status(200).json({
      username: user.username,
      description: e.description,
      duration: e.duration,
      date: e.date.toDateString(),
      _id: user._id,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// get exercise log
app.get("/api/users/:_id/logs", async (req, res) => {
  const { from, to, limit } = req.query;
  const id = req.params._id;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    let logs = user.log;

    if (from) {
      const fromDate = new Date(from);
      logs = logs.filter((item) => new Date(item.date) >= fromDate);
    }

    if (to) {
      const toDate = new Date(to);
      logs = logs.filter((item) => new Date(item.date) <= toDate);
    }
    if (limit) {
      logs = logs.slice(0, parseInt(limit));
    }
    const formattedLogs = logs.map((entry) => ({
      description: entry.description,
      duration: entry.duration,
      date: new Date(entry.date).toDateString(),
    }));
    res.status(200).json({
      username: user.username,
      count: formattedLogs.length,
      _id: user._id,
      log: formattedLogs,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
