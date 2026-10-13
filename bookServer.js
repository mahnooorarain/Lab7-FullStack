const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const FILE = path.join(__dirname, "books.json");

app.use(express.json());

// Har request terminal mein dikhegi (debugging ke liye)
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// Agar books.json nahi hai to bana do
if (!fs.existsSync(FILE)) {
  fs.writeFileSync(
    FILE,
    JSON.stringify(
      [
        { id: 1, title: "Introduction to Programming", author: "John Smith", price: 1500 },
        { id: 2, title: "Data Structures", author: "Sara Ahmed", price: 1800 },
        { id: 3, title: "Database Systems", author: "Ali Raza", price: 2200 },
      ],
      null,
      2
    )
  );
}

let books = JSON.parse(fs.readFileSync(FILE, "utf8"));

function saveBooks() {
  fs.writeFileSync(FILE, JSON.stringify(books, null, 2));
}

function isValid(b) {
  return (
    b &&
    typeof b.title === "string" && b.title.trim() !== "" &&
    typeof b.author === "string" && b.author.trim() !== "" &&
    typeof b.price === "number" && Number.isFinite(b.price) && b.price > 0
  );
}

// GET all books
app.get("/books", (req, res) => {
  res.status(200).json(books);
});

// GET one book
app.get("/books/:id", (req, res) => {
  const book = books.find((b) => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.status(200).json(book);
});

// POST create book
app.post("/books", (req, res) => {
  if (!isValid(req.body)) {
    return res.status(400).json({ error: "Title and author must be non-empty strings, price must be a positive number" });
  }
  const newId = books.length ? Math.max(...books.map((b) => b.id)) + 1 : 1;
  const book = {
    id: newId,
    title: req.body.title.trim(),
    author: req.body.author.trim(),
    price: req.body.price,
  };
  books.push(book);
  saveBooks();
  res.status(201).json(book);
});

// PUT update book
app.put("/books/:id", (req, res) => {
  const book = books.find((b) => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ error: "Book not found" });
  if (!isValid(req.body)) {
    return res.status(400).json({ error: "Title and author must be non-empty strings, price must be a positive number" });
  }
  book.title = req.body.title.trim();
  book.author = req.body.author.trim();
  book.price = req.body.price;
  saveBooks();
  res.status(200).json(book);
});

// DELETE book
app.delete("/books/:id", (req, res) => {
  const index = books.findIndex((b) => b.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Book not found" });
  books.splice(index, 1);
  saveBooks();
  res.status(200).json({ message: "Book deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Book API running at http://localhost:${PORT}`);
});