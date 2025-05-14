// Environment vars & packages init
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/states', require('./routes/states'));

// Set header...
app.get('/', (req, res) => {
    res.type('html');
    res.send('<h1>Final API - States Data</h1>');
});

// Standard error handler...
app.all('*', (req, res) => {
    res.type('html');
    res.status(404).send('<h1>404 Not Found for Final API - States Data</h1>');
});

// Start...
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));