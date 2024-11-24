// src/routes/medicineRoutes.js
const express = require('express');
const { addMedicine, getMedicinesByWholesaler } = require('../controllers/medicine');
const { authenticate } = require('../auth/authMiddleware');

const router = express.Router();

// Add medicine (Wholesaler Only)
router.post('/', authenticate, addMedicine);

// Get medicines by wholesaler (For Retailer)
router.get('/:wholesalerId', authenticate, getMedicinesByWholesaler);

module.exports = router;
