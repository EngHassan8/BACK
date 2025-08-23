const mongoose = require("mongoose");

const newElectionSchema = new mongoose.Schema({
  Name: { type: String, required: true, trim: true },
  Position: { type: String, required: true, trim: true },
  StartDate: { type: Date, required: true },
  EndDate: { type: Date, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model("electionNew", newElectionSchema);
