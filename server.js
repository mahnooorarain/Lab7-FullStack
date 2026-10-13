const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const FILE = path.join(__dirname, "students.json");

app.use(express.json());

// Load saved students when the server starts
let students = JSON.parse(fs.readFileSync(FILE, "utf8"));

// Save helper: called after every successful POST, PUT, DELETE
function saveStudents() {
  fs.writeFileSync(FILE, JSON.stringify(students, null, 2));
}

// Validation: name and department must be non-empty strings
function isValid(body) {
  return (
    body &&
    typeof body.name === "string" && body.name.trim() !== "" &&
    typeof body.department === "string" && body.department.trim() !== ""
  );
}

// GET all students
app.get("/students", (req, res) => {
  res.status(200).json(students);
});

// GET by department (must be BEFORE /students/:id)
app.get("/students/department/:department", (req, res) => {
  const dept = req.params.department.toLowerCase();
  const result = students.filter((s) => s.department.toLowerCase() === dept);
  res.status(200).json(result);
});

// GET one student
app.get("/students/:id", (req, res) => {
  const student = students.find((s) => s.id === Number(req.params.id));
  if (!student) return res.status(404).json({ error: "Student not found" });
  res.status(200).json(student);
});

// POST create student
app.post("/students", (req, res) => {
  if (!isValid(req.body)) {
    return res.status(400).json({ error: "Name and department must be non-empty strings" });
  }
  const newId = students.length ? Math.max(...students.map((s) => s.id)) + 1 : 1;
  const student = { id: newId, name: req.body.name.trim(), department: req.body.department.trim() };
  students.push(student);
  saveStudents();
  res.status(201).json(student);
});

// PUT update student
app.put("/students/:id", (req, res) => {
  const student = students.find((s) => s.id === Number(req.params.id));
  if (!student) return res.status(404).json({ error: "Student not found" });
  if (!isValid(req.body)) {
    return res.status(400).json({ error: "Name and department must be non-empty strings" });
  }
  student.name = req.body.name.trim();
  student.department = req.body.department.trim();
  saveStudents();
  res.status(200).json(student);
});

// DELETE student
app.delete("/students/:id", (req, res) => {
  const index = students.findIndex((s) => s.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Student not found" });
  students.splice(index, 1);
  saveStudents();
  res.status(200).json({ message: "Student deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});