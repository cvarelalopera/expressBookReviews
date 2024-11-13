const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

// Use environment variables for sensitive information
const JWT_SECRET = process.env.JWT_SECRET || 'access';  // Replace with your secret key from environment
const SESSION_SECRET = process.env.SESSION_SECRET || 'fingerprint_customer';

app.use(express.json());

// Session management for customer routes
app.use("/customer", session({ secret: SESSION_SECRET, resave: true, saveUninitialized: true }));

// Authentication middleware for customer routes
app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if user has a valid session
    if (req.session.authorization) {
        const token = req.session.authorization['accessToken'];

        // Verify JWT token
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                // Handle JWT errors, such as invalid or expired token
                return res.status(403).json({ message: "User not authenticated, invalid or expired token" });
            } else {
                req.user = user;
                next();  // Proceed to the next middleware
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

// Define routes
const PORT = process.env.PORT || 5000;
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Start server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
