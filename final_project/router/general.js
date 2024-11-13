const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// POST /register - User registration
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }
    
    // Check if user already exists
    let existingUser = users.find((user) => user.username === username);
    if (existingUser) {
        return res.status(409).json({ message: "User already exists." });
    }

    // Register the new user
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully." });
});

// GET / - Retrieve the list of all books
public_users.get('/', (req, res) => {
    return res.status(200).json(books);
});

// GET /isbn/:isbn - Retrieve book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    
    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// GET /author/:author - Retrieve book details based on author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;
    const filteredBooks = Object.values(books).filter((book) => book.author === author);
    
    if (filteredBooks.length > 0) {
        return res.status(200).json(filteredBooks);
    } else {
        return res.status(404).json({ message: "No books found by this author" });
    }
});

// GET /title/:title - Retrieve book details based on title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;
    const filteredBooks = Object.values(books).filter((book) => book.title === title);
    
    if (filteredBooks.length > 0) {
        return res.status(200).json(filteredBooks);
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
});

// GET /review/:isbn - Retrieve book review based on ISBN
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    
    if (book && book.reviews) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "No reviews found for this book" });
    }
});

module.exports.general = public_users;
