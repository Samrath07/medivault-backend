// src/models/Wholesaler.js
const mongoose = require('mongoose');

const wholesalerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    contactNumber: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    completedProfile: { type: Boolean, default: false },
});

module.exports = mongoose.model('Wholesaler', wholesalerSchema);
