const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register endpoint
public_users.post("/register", (req, res) => {
  // Registration logic
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
  return res.status(200).json(Object.values(books.books));  // Return all books
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books.getBookByISBN(isbn);  // Using helper function

  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  const booksByAuthor = books.getBooksByAuthor(author);  // Using helper function

  if (booksByAuthor.length > 0) {
    res.status(200).json(booksByAuthor);
  } else {
    res.status(404).json({ message: "No books found by this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  const booksByTitle = books.getBooksByTitle(title);  // Using helper function

  if (booksByTitle.length > 0) {
    res.status(200).json(booksByTitle);
  } else {
    res.status(404).json({ message: "No books found with this title" });
  }
});

// Get book review based on ISBN
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books.getBookByISBN(isbn);  // Using helper function

  if (book) {
    res.status(200).json(book.reviews);  // Return reviews for the book
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Add a review to a book (POST request)
public_users.post('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;  // Assuming the review is sent in the request body
  
  const updatedBook = books.addReview(isbn, review);  // Using helper function

  if (updatedBook) {
    res.status(201).json(updatedBook);  // Return updated book after adding review
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;