const { v4: uuidv4 } = require("uuid");

let books = [
  { id: uuidv4(), title: "The Alchemist", author: "Paulo Coelho", genre: "Fiction", yearPublished: 1988 },
  { id: uuidv4(), title: "Clean Code", author: "Robert C. Martin", genre: "Programming", yearPublished: 2008 }
];

module.exports = books;
