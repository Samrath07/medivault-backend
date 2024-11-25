// src/controllers/medicineController.js
const Medicine = require('../models/Medicine');

exports.addMedicine = async (req, res) => {
  try {
    if (req.user.role !== 'wholesaler') {
      return res
        .status(403)
        .json({
          message: 'Access denied. Only wholesalers can add medicines.',
        });
    }

    const {
      medicine_name,
      description,
      brand,
      price,
      category,
      expiry_date,
      stock_level,
      reorder_level,
    } = req.body;

    if (
      !medicine_name ||
      !price ||
      !stock_level ||
      !brand ||
      !category ||
      !expiry_date
    ) {
      return res
        .status(400)
        .json({
          message: 'medicine_name, price,brand, category,expiry_date and stockQuantity are required.',
        });
    }

    const medicine = new Medicine({
      wholesalerId: req.user.id,
      medicine_name,
      description,
      brand,
      price,
      category,
      expiry_date,
      stock_level,
      reorder_level,
    });

    await medicine.save();

    res.status(201).json({ message: 'Medicine added successfully.', medicine });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
exports.getMedicinesByWholesaler = async (req, res) => {
  try {
    const { wholesalerId } = req.params;

    const medicines = await Medicine.find({ wholesalerId });

    if (medicines.length === 0) {
      return res
        .status(404)
        .json({ message: 'No medicines found for this wholesaler.' });
    }

    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
