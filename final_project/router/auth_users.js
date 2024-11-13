const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  // Sample user data structure
  // Example: { username: "user1", password: "password123" }
];

// Helper function to check if the username is valid
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Helper function to authenticate user
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '1h' }); // JWT secret key
  res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret'); // Verify token
    const username = decoded.username;
    const book = books.getBookByISBN(isbn); // Assuming this function is available in booksdb.js

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Add review to the book's reviews (assuming review is added as an object with username and text)
    if (!book.reviews) {
      book.reviews = {};
    }

    book.reviews[username] = review; // Adding/Updating review
    res.status(200).json({ message: "Review added successfully", book });
  } catch (error) {
    return res.status(400).json({ message: "Invalid token" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
