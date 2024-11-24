// src/controllers/orderController.js
const Order = require('../models/Order');
const Medicine = require('../models/Medicine');

exports.placeOrder = async (req, res) => {
    try {
        const { wholesalerId, medicines } = req.body;

        if (!medicines || medicines.length === 0) {
            return res.status(400).json({ message: 'At least one medicine must be selected.' });
        }

        let totalAmount = 0;

        // Validate each medicine
        for (const item of medicines) {
            const medicine = await Medicine.findById(item.medicineId);

            if (!medicine) {
                return res.status(404).json({ message: `Medicine with ID ${item.medicineId} not found.` });
            }

            if (medicine.wholesalerId.toString() !== wholesalerId) {
                return res.status(400).json({ message: `Medicine ${medicine.medicineName} does not belong to the selected wholesaler.` });
            }

            if (medicine.stockQuantity < item.quantity) {
                return res.status(400).json({
                    message: `Not enough stock for medicine ${medicine.medicineName}. Available: ${medicine.stockQuantity}`,
                });
            }

            totalAmount += medicine.price * item.quantity;
        }

        // Create the order
        const order = new Order({
            retailerId: req.user.id,
            wholesalerId,
            medicines,
            totalAmount,
        });

        await order.save();

        res.status(201).json({ message: 'Order placed successfully.', order });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// src/controllers/orderController.js
exports.getOrdersForWholesaler = async (req, res) => {
    try {
        // Ensure the user is a wholesaler
        if (req.user.role !== 'wholesaler') {
            return res.status(403).json({ message: 'Access denied. Only wholesalers can view orders.' });
        }

        // Fetch all orders associated with the authenticated wholesaler
        const orders = await Order.find({ wholesalerId: req.user.id })
            .populate('retailerId', 'name email') // Include retailer details (name, email)
            .populate('medicines.medicineId', 'medicineName price'); // Include medicine details (name, price)

        // If no orders found, return a message
        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found.' });
        }

        // Send the list of orders to the wholesaler
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Must be "accepted" or "rejected".' });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        if (order.wholesalerId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied. You cannot update this order.' });
        }

        // Update stock only if the order is accepted
        if (status === 'accepted') {
            for (const item of order.medicines) {
                const medicine = await Medicine.findById(item.medicineId);

                if (medicine.stockQuantity < item.quantity) {
                    return res.status(400).json({
                        message: `Not enough stock for medicine ${medicine.medicineName}. Available: ${medicine.stockQuantity}`,
                    });
                }

                medicine.stockQuantity -= item.quantity;
                await medicine.save();
            }
        }

        order.status = status;
        await order.save();

        res.status(200).json({ message: `Order ${status} successfully.`, order });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
