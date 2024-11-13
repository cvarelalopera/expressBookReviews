let books = {
    '1': {"author": "Chinua Achebe", "title": "Things Fall Apart", "reviews": [] },
    '2': {"author": "Hans Christian Andersen", "title": "Fairy tales", "reviews": [] },
    '3': {"author": "Dante Alighieri", "title": "The Divine Comedy", "reviews": [] },
    '4': {"author": "Unknown", "title": "The Epic Of Gilgamesh", "reviews": [] },
    '5': {"author": "Unknown", "title": "The Book Of Job", "reviews": [] },
    '6': {"author": "Unknown", "title": "One Thousand and One Nights", "reviews": [] },
    '7': {"author": "Unknown", "title": "Njál's Saga", "reviews": [] },
    '8': {"author": "Jane Austen", "title": "Pride and Prejudice", "reviews": [] },
    '9': {"author": "Honoré de Balzac", "title": "Le Père Goriot", "reviews": [] },
    '10': {"author": "Samuel Beckett", "title": "Molloy, Malone Dies, The Unnamable, the trilogy", "reviews": [] }
};

// Function to get book by ISBN
const getBookByISBN = (isbn) => {
    return books[isbn] || null;
};

// Function to get books by author
const getBooksByAuthor = (author) => {
    let result = [];
    for (let key in books) {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
            result.push(books[key]);
        }
    }
    return result;
};

// Function to get books by title
const getBooksByTitle = (title) => {
    let result = [];
    for (let key in books) {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
            result.push(books[key]);
        }
    }
    return result;
};

// Function to add a review to a book by ISBN
const addReview = (isbn, review) => {
    if (books[isbn]) {
        books[isbn].reviews.push(review);  // Push the review to the reviews array
        return books[isbn];
    } else {
        return null;  // Return null if the book with the given ISBN doesn't exist
    }
};

// Exporting books object and functions
module.exports = {
    books,
    getBookByISBN,
    getBooksByAuthor,
    getBooksByTitle,
    addReview
};
