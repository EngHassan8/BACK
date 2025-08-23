const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Email: { type: String, required: true },
  ID: { type: String, required: true },
  Position: { type: String, required: true },
  electionId: { type: mongoose.Schema.Types.ObjectId, ref: "electionNew", required: true },
  image: { type: String, required: true },
  voteCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Candidate', candidateSchema);
