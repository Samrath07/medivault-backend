// src/models/Medicine.js
const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    wholesalerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    medicine_name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock_level: { type: Number, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    expiry_date: { type: Date, required: true },
    reorder_level : {type: Number}
});

module.exports = mongoose.model('Medicine', medicineSchema);
