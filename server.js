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

// Set FULL HTML header...
app.get('/', (req, res) => {
  res.type('html');
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Final API</title>
      </head>
      <body>
        <h1>Final API - States Data</h1>
      </body>
    </html>
  `);
});

// Standard FULL HTML error handler...
app.all('*', (req, res) => {
  res.type('html');
  res.status(404).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>404 Not Found</title>
      </head>
      <body>
        <h1>404 Not Found for Final API - States Data</h1>
      </body>
    </html>
  `);
});

// Start...
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));