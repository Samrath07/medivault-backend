// src/controllers/wholesalerController.js
const Wholesaler = require('../models/wholesaler');

exports.completeProfile = async (req, res) => {

    try {
        const userId = req.user.id; // Assuming user ID is extracted from the JWT

        const { contactNumber, city, address } = req.body;

        // Validate input
        if (!contactNumber || !city || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the wholesaler already has a profile
        let profile = await Wholesaler.findOne({ userId });

        if (profile) {
            // Update existing profile
            profile.contactNumber = contactNumber;
            profile.city = city;
            profile.address = address;
            profile.completedProfile = true;
        } else {
            // Create a new profile
            profile = new Wholesaler({
                userId,
                contactNumber,
                city,
                address,
                completedProfile: true,
            });
        }

        await profile.save();

        res.status(200).json({
            message: "Profile updated successfully",
            profile,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


// src/controllers/wholesalerController.js
exports.getWholesalers = async (req, res) => {
    try {
        const wholesalers = await Wholesaler.find({ completedProfile: true }).select(
            'userId contactNumber city address'
        );

        res.status(200).json(wholesalers);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

