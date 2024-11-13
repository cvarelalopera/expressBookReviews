const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const regd_users = express.Router();
//let books = require("./booksdb.js");
const { books, getBookByISBN, getBooksByAuthor, getBooksByTitle, addReview } = require('./booksdb.js');

//let addReview = require("./booksdb.js");

let users = [];  // In-memory users storage (replace with DB in production)

const isValid = (username) => { // Check if the username is valid
  return users.some(user => user.username === username); // Returns true if username exists
};

const authenticatedUser = (username, password) => { // Check if the username and password match
  return users.some(user => user.username === username && user.password === password); // Match both username and password
};

// POST /register - Register a new user
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body; // Assuming you're sending these fields

  // Check if the username is already taken
  if (isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Validate password length (example: should be at least 6 characters)
  if (password.length < 6) {
    return res.status(400).json({ message: "Password should be at least 6 characters" });
  }

  // Add the new user to the 'users' array
  users.push({ username, password });

  return res.status(201).json({ message: "User registered successfully" });
});

// POST /login - Login a user
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are valid
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Create JWT token
  const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });

  // Save the token in session
  req.session.authorization = { accessToken };

  return res.status(200).json({ message: "Login successful", accessToken });
});

// PUT /auth/review/:isbn - Add a book review (authenticated route)
regd_users.put("/auth/review/:isbn", (req, res) => {
    let { isbn } = req.params;
    isbn = String(isbn);  // Ensure the ISBN is treated as a string

    // Debugging output
    console.log("Requested ISBN:", isbn);  // Logs the received ISBN
    console.log("Available books:", books);  // Logs the entire books object

    // Call the function to retrieve the book by ISBN
    const book = getBookByISBN(isbn); 
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Proceed with adding the review to the book
    const { review } = req.body;
    const token = req.session.authorization['accessToken'];

    // Verify JWT and add review
    jwt.verify(token, "access", (err, user) => {
        if (err) {
            return res.status(403).json({ message: "User not authenticated" });
        }
        
        // Add or update the review for the user
        book.reviews[user.username] = review;
        return res.status(200).json({ message: "Review added successfully" });
    });
});
// DELETE /auth/review/:isbn - Delete a book review (authenticated route)
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;

    // Ensure the user is authenticated (check for authorization)
    if (!req.session.authorization) {
        return res.status(403).json({ message: "User not authenticated" });
    }

    // Retrieve the access token from the session
    const token = req.session.authorization['accessToken'];

    // Verify the JWT token
    jwt.verify(token, "access", (err, user) => {
        if (err) {
            return res.status(403).json({ message: "User not authenticated" });
        }

        // Find the book by ISBN
        const book = getBookByISBN(isbn);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Check if the user has a review for the book
        if (!book.reviews[user.username]) {
            return res.status(404).json({ message: "Review not found for this user" });
        }

        // Delete the user's review
        delete book.reviews[user.username];

        return res.status(200).json({ message: "Review deleted successfully" });
    });
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
