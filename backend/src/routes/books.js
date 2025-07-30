const express = require("express");
const router = express.Router();
const authMiddleware = require("../authMiddleware");
const { v4: uuidv4 } = require("uuid");
let books = require("../data/books");


router.get("/", authMiddleware, (req, res) => res.json(books));

router.post("/", (req, res) => {
  const newBook = { id: uuidv4(), ...req.body };
  books.push(newBook);
  res.status(201).json(newBook);
});

router.put("/:id", authMiddleware, (req, res) => {
  const index = books.findIndex(book => book.id === req.params.id);
  if (index !== -1) {
    books[index] = { ...books[index], ...req.body };
    res.json(books[index]);
  } else {
    res.sendStatus(404);
  }
});

router.delete("/:id", authMiddleware, (req, res) => {
  books = books.filter(book => book.id !== req.params.id);
  res.sendStatus(204);
});

module.exports = router;
