// Mongoose instantiate...
const mongoose = require('mongoose');

// Mongoose Schema instantiate for fun facts...
const stateSchema = new mongoose.Schema({
  stateCode: {
    type: String,
    required: true,
    unique: true
  },
  funfacts: [String]
});

// Export for MongoDB
module.exports = mongoose.model('State', stateSchema);