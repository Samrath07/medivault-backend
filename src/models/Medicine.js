// src/models/Medicine.js
const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    wholesalerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    medicineName: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stockQuantity: { type: Number, required: true },
});

module.exports = mongoose.model('Medicine', medicineSchema);
