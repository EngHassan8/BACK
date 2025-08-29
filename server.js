const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");

const app = express();

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://engHassan:sDCOYG47MCBWjtjU@cluster0.ybtkrrk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("Database has been connected"))
  .catch((err) => console.log(err));

// Import your schemas (make sure these paths and names are correct)
const TotalVotes = require("./modal/TotalVotes");
const elctionNew = require("./modal/electionNew");
const Candidates = require("./modal/Candidates");
const Votes = require("./modal/Votes");
const Admin = require("./modal/Admin");

// Static folder for images
app.use("/sawir", express.static("images"));

// Multer setup for images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "images"),
  filename: (req, file, cb) => cb(null, file.originalname),
});

const upload = multer({ storage });

// ===== Routes =====

// POST create TotalVotes with image
app.post("/create", upload.single("img"), async (req, res) => {
  try {
    const newData = new TotalVotes({
      Name: req.body.Name,
      ID: req.body.ID,
      Password: req.body.Password,
      Email: req.body.Email,
      Mobile: req.body.Mobile,
      image: req.file.filename,
    });

    const saveExam = await newData.save();
    if (saveExam) {
      return res.send("Xogta moalimka waad xareysey");
    }
    res.status(500).send("Saving failed");
  } catch (error) {
    res.status(500).send("Error saving data: " + error.message);
  }
});

// POST admin voter login check
app.post("/admin/voter", async (req, res) => {
  try {
    const { Name, ID } = req.body;
    const student = await TotalVotes.findOne({ Name, ID });
    if (!student) {
      return res.status(401).json({ success: false, error: "Name or ID incorrect" });
    }
    const { _id, Name: n, ID: id } = student;
    res.json({ success: true, data: { _id, Name: n, ID: id } });
  } catch (err) {
    console.error("POST /admin/voter error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// GET voter profile
app.get("/voter/profile", async (req, res) => {
  const { Name, ID } = req.query;
  if (!Name || !ID) {
    return res.status(400).json({ error: "Name and ID are required" });
  }
  try {
    const voter = await TotalVotes.findOne({ Name, ID });
    if (!voter) {
      return res.status(404).json({ error: "Voter not found" });
    }
    res.json(voter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET all TotalVotes
app.get("/get", async (req, res) => {
  const GetDATA = await TotalVotes.find();
  res.send(GetDATA);
});

// UPDATE TotalVotes by id
app.put("/update/:id", async (req, res) => {
  const updateData = await TotalVotes.updateOne({ _id: req.params.id }, { $set: req.body });
  if (updateData.modifiedCount > 0) {
    res.send("Data has been updated");
  } else {
    res.status(404).send("Data not found or not updated");
  }
});

// DELETE TotalVotes by id
app.delete("/remove/:id", async (req, res) => {
  const GetDelete = await TotalVotes.deleteOne({ _id: req.params.id });
  if (GetDelete.deletedCount > 0) {
    res.send("Data has been deleted");
  } else {
    res.status(404).send("Data not found");
  }
});

// Total count of TotalVotes
app.get("/total", async (req, res) => {
  const count = await TotalVotes.countDocuments();
  res.json({ total: count });
});

// ElectionNew routes

// POST new election

// ✅ Create election (typo sax ah)
app.post("/new/election", async (req, res) => {
  try {
    const newElection = new elctionNew(req.body);
    const saved = await newElection.save();
    if (saved) {
      res.send("Election created successfully");
    }
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});


// GET all elections
app.get("/get/election", async (req, res) => {
  try {
    const data = await elctionNew.find();
    res.json(data);
  } catch (err) {
    console.error("Error fetching elections:", err.message);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});


// UPDATE election by id
app.put("/update/election/:id", async (req, res) => {
  const updateData = await elctionNew.updateOne({ _id: req.params.id }, { $set: req.body });
  if (updateData.modifiedCount > 0) {
    res.send("Data has been updated");
  } else {
    res.status(404).send("Data not found or not updated");
  }
});

// Update election status
app.put("/election/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const election = await elctionNew.findByIdAndUpdate(id, { status }, { new: true });
    if (!election) return res.status(404).send("Election not found");
    res.json(election);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// Total count of elections
app.get("/total/election", async (req, res) => {
  const totalElection = await elctionNew.countDocuments();
  res.send({ totalElection });
});

// DELETE election by id
app.delete("/remove/election/:id", async (req, res) => {
  const GetDelete = await elctionNew.deleteOne({ _id: req.params.id });
  if (GetDelete.deletedCount > 0) {
    res.send("Data has been deleted");
  } else {
    res.status(404).send("Data not found");
  }
});

// Candidates routes

// Route
app.post("/new/Candidates", upload.single("img"), async (req, res) => {
  try {
    const { Name, Email, ID, Position, electionId } = req.body; // ✅ electionId ka hel
    if (!electionId) {
      return res.status(400).json({ error: "electionId is required" });
    }

    const newCandidate = new Candidates({
      Name,
      Email,
      ID,
      Position,
      electionId, // ✅ kaydi electionId
      image: req.file.filename
    });

    await newCandidate.save();
    res.status(201).json({ message: "Candidate saved successfully" });
  } catch (err) {
    console.error("Error while saving candidate:", err);
    res.status(500).json({ error: err.message });
  }
});
// GET candidates (optionally filter by position)
app.get("/get/candidate", async (req, res) => {
  try {
    const { position } = req.query;
    const filter = position ? { Position: position } : {};
    const candidates = await Candidates.find(filter);
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ message: "Error getting candidates", err });
  }
});

// UPDATE candidate by id
app.put("/update/candidate/:id", async (req, res) => {
  const updateData = await Candidates.updateOne({ _id: req.params.id }, { $set: req.body });
  if (updateData.modifiedCount > 0) {
    res.send("Data has been updated");
  } else {
    res.status(404).send("Data not found or not updated");
  }
});

// DELETE candidate by id
app.delete("/remove/candidate/:id", async (req, res) => {
  const GetDelete = await Candidates.deleteOne({ _id: req.params.id });
  if (GetDelete.deletedCount > 0) {
    res.send("Data has been deleted");
  } else {
    res.status(404).send("Data not found");
  }
});

// Votes routes

// POST vote
app.post("/vote", async (req, res) => {
  try {
    const { voterId, candidateId, Position } = req.body;

    // Hubi in qofkani horey cod u dhiibay booskan
    const existingVote = await Votes.findOne({ voterId, Position });
    if (existingVote) {
      return res.status(400).json({ error: "Cod hore ayaa loo dhiibtay booskan." });
    }

    const newVote = new Votes({ voterId, candidateId, Position });
    await newVote.save();

    await Candidates.findByIdAndUpdate(candidateId, { $inc: { voteCount: 1 } });

    res.status(200).json({ message: "Codka waa la diiwaangeliyey!" });
  } catch (error) {
    console.error("Vote error:", error);
    res.status(500).json({ error: "Waxaa dhacay qalad server-ka ah." });
  }
});


// GET results (return candidates with their voteCount)
app.get("/results", async (req, res) => {
  try {
    const results = await Candidates.find({}, "Name voteCount image");
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching results.", error });
  }
});

// GET vote check all for a voterId
app.get('/vote/checkAll', async (req, res) => {
  try {
    const voterId = req.query.voterId;
    if (!voterId) return res.status(400).json({ error: "Missing voterId" });

    const votes = await Votes.find({ voterId });

    const votedPositions = votes.map(vote => ({
      position: vote.Position || "Unknown",
      candidateId: vote.candidateId ? vote.candidateId.toString() : null,
    }));

    res.json({ votedPositions });
  } catch (error) {
    console.error("Error in /vote/checkAll:", error);
    res.status(500).json({ error: "Server error while fetching votes" });
  }
});

///////////////
app.delete("/vote/remove", async (req, res) => {
  try {
    const { voterId, Position } = req.body;
    const vote = await Votes.findOne({ voterId, Position });
    if (!vote) return res.status(404).json({ message: "Vote not found" });

    await Candidates.findByIdAndUpdate(vote.candidateId, { $inc: { voteCount: -1 } });
    await Votes.deleteOne({ _id: vote._id });

    res.status(200).json({ message: "Vote deleted and candidate vote count updated" });
  } catch (err) {
    console.error("Error deleting vote:", err);
    res.status(500).json({ error: "Error deleting vote" });
  }
});





// DELETE vote by id
app.delete("/vote/:id", async (req, res) => {
  try {
    const vote = await Votes.findById(req.params.id);
    if (!vote) return res.status(404).json("Vote not found");

    // Decrease candidate's vote count
    await Candidates.findByIdAndUpdate(vote.candidateId, { $inc: { voteCount: -1 } });

    // Delete vote
    await Votes.findByIdAndDelete(req.params.id);

    res.status(200).json("Vote deleted and candidate vote count updated");
  } catch (err) {
    console.error("Vote delete error:", err);
    res.status(500).json({ error: "Error deleting vote" });
  }
});

// Admin routes

// POST admin register
app.post("/damin/Register", async (req, res) => {
  try {
    const newAdmin = new Admin(req.body);
    const saveAdmin = await newAdmin.save();
    if (saveAdmin) {
      res.send("Database has been successfully saved");
    }
  } catch (error) {
    res.status(500).send("Error saving admin: " + error.message);
  }
});

// POST admin login
app.post("/admin/login", async (req, res) => {
  try {
    const admin = await Admin.findOne(req.body).select("-password");
    if (admin) {
      res.send({ success: "Login successfully", data: admin });
    } else {
      res.status(401).send({ error: "Username or password incorrect" });
    }
  } catch (error) {
    res.status(500).send("Server error: " + error.message);
  }
});

// GET all admins
app.get("/get/Mamule", async (req, res) => {
  const GetaDate = await Admin.find();
  res.send(GetaDate);
});

// PUT update admin by ID
// PUT update admin
app.put("/admin/update/:id", async (req, res) => {
  try {
    const result = await Admin.updateOne({ _id: req.params.id }, { $set: req.body });
    if (result.modifiedCount > 0) res.send("Admin updated successfully");
    else res.status(404).send("Admin not found");
  } catch (error) {
    res.status(500).send("Error updating admin: " + error.message);
  }
});

// DELETE admin by ID
app.delete("/admin/remove/:id", async (req, res) => {
  try {
    const result = await Admin.deleteOne({ _id: req.params.id });
    if (result.deletedCount > 0) res.send("Admin deleted successfully");
    else res.status(404).send("Admin not found");
  } catch (error) {
    res.status(500).send("Error deleting admin: " + error.message);
  }
});


// Start server on port 3000
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
