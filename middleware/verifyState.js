// Instantiate with JSON states' data
const states = require('../models/statesData.json');

// Get two-letter state codes
const stateCodes = states.map(state => state.code);

// Middleware
const verifyState = (req, res, next) => {
  const input = req.params.state.toUpperCase();

  // Error handling...
  if (!stateCodes.includes(input)) {
    return res.status(400).json({ error: 'Invalid state abbreviation parameter' });
  }

  // Set state code and continue...
  req.code = input;
  next();
};

// Export for routes/states.js
module.exports = verifyState;