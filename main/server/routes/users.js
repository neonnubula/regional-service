const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const User = require('../models/User'); // Adjust the path as necessary

const router = express.Router();

// POST route for user registration
router.post('/register',
    // Validation Middleware (Example)
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    async (req, res) => {
        console.log("Received registration request:", req.body); // Log the incoming request data

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Check if user already exists
            let user = await User.findOne({ email: req.body.email });
            console.log("Checked if user exists:", user); // Log the result of user existence check

            if (user) {
                console.log("User already exists");
                return res.status(400).json({ msg: 'User already exists' });
            }

            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            // Create a new user
            user = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
                userType: req.body.userType
            });

            await user.save();
            console.log("User registered successfully"); // Log successful registration
            res.status(201).json({ msg: 'User registered successfully' });
        } catch (err) {
            console.error("Error during registration:", err.message); // Log any errors
            res.status(500).send('Server error');
        }
    }
);

// GET route for user profile (as an example)
router.get('/profile', async (req, res) => {
    // Profile retrieval logic goes here
    // Add necessary code and console logs
});

// Add other routes as necessary

module.exports = router;
