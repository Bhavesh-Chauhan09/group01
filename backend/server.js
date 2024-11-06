// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from a .env file

const app = express();

// Middleware
app.use(express.json()); // To handle JSON payloads
app.use(cors({
    origin: '*',  // or use "*" for all origins (not recommended in production)
    methods: ['GET', 'POST', 'DELETE','PATCH'],       // Add other methods if needed
    credentials: true,
  }));
// Log the MongoDB URI to verify it's being loaded
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
    console.error("MongoDB URI not defined in .env");
    process.exit(1); // Stop the server if no MongoDB URI is provided
}
console.log('Connecting to MongoDB...');

// MongoDB Atlas connection
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Stop the server if there is a connection error
    });

// Importing routes
const usersRouter = require('./routes/users');
const goalsRouter = require('./routes/goals');
const workoutsRouter = require('./routes/workouts');
const metricsRouter = require('./routes/metrics');


// Use the routes after middleware
app.use('/api/users', usersRouter);
app.use('/api/goals', goalsRouter);
app.use('/api/workouts', workoutsRouter);
app.use('/api/metrics', metricsRouter);

// Sample route to test the server
app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); // Corrected line
});
