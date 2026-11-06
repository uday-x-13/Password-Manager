const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // serve frontend

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/passwordDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Schema
const passwordSchema = new mongoose.Schema({
    site: String,
    username: String,
    password: String
});

// Model
const Password = mongoose.model("Password", passwordSchema);

// Save password
app.post("/save", async (req, res) => {
    try {
        const data = new Password(req.body);
        await data.save();
        res.send("Saved Successfully");
    } catch (err) {
        res.status(500).send("Error saving data");
    }
});

// Get all passwords
app.get("/get", async (req, res) => {
    try {
        const data = await Password.find();
        res.json(data);
    } catch (err) {
        res.status(500).send("Error fetching data");
    }
});

// Start server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});

app.delete("/delete/:id", async (req, res) => {
    await Password.findByIdAndDelete(req.params.id);
    res.send("Deleted");
});
app.put("/update/:id", async (req, res) => {
    await Password.findByIdAndUpdate(req.params.id, req.body);
    res.send("Updated");
});