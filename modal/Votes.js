const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  voterId: { type: String, required: true },
  candidateId: { type: String, required: true },
  Position: { type: String, required: true },
});

// SAX: Hal mar per position
voteSchema.index({ voterId: 1, Position: 1 }, { unique: true });

module.exports = mongoose.model('Votes', voteSchema);
