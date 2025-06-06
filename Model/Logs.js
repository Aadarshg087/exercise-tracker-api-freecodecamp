const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  count: Number,
  log: [{ description: String, duration: Number, date: Date }],
});

const Log = mongoose.model("Log", logsSchema);

module.exports = Log;
