const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json()); // Middleware to parse JSON

// Connect to MongoDB
mongoose
    .connect("mongodb://localhost:27017/Crudmongo", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Could not connect to MongoDB", err));

// Define a schema and model for students
const studentSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    section: { type: Number, required: true },
    branch: { type: String, required: true },
});

const Student = mongoose.model("Student", studentSchema);

// GET all students
app.get("/api/student", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).send("Error fetching students");
    }
});

// GET a student by ID
app.get("/api/student/:id", async (req, res) => {
    try {
        const student = await Student.findOne({ id: req.params.id });
        if (!student) return res.status(404).send("Student not found");
        res.json(student);
    } catch (err) {
        res.status(500).send("Error fetching student");
    }
});

// POST (Create a new student)
app.post("/api/student", async (req, res) => {
    try {
        const newStudent = new Student({
            id: req.body.id,
            name: req.body.name,
            section: req.body.section,
            branch: req.body.branch,
        });
        await newStudent.save();
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(500).send("Error creating student");
    }
});

// PATCH (Update a student)
app.patch("/api/student/:id", async (req, res) => {
    try {
        const student = await Student.findOneAndUpdate(
            { id: req.params.id },
            {
                name: req.body.name,
                section: req.body.section,
                branch: req.body.branch,
            },
            { new: true } // Return the updated document
        );

        if (!student) return res.status(404).send("Student not found");
        res.json(student);
    } catch (err) {
        res.status(500).send("Error updating student");
    }
});

// DELETE (Remove a student)
app.delete("/api/student/:id", async (req, res) => {
    try {
        const result = await Student.findOneAndDelete({ id: req.params.id });
        if (!result) return res.status(404).send("Student not found");
        res.json({ message: "Student deleted successfully" });
    } catch (err) {
        res.status(500).send("Error deleting student");
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));