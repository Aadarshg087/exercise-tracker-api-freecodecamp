const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  //   UserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  description: String,
  duration: Number,
  date: { type: Date },
});

const Exercise = mongoose.model("Exercise", exerciseSchema);

module.exports = Exercise;
