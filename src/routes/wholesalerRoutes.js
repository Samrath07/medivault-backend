const express = require('express');
const { completeProfile, getWholesalers } = require('../controllers/wholesaler');
const authMiddleware = require('../auth/authMiddleware'); // Ensures the user is authenticated

const router = express.Router();

router.post('/profile', authMiddleware.authenticate,completeProfile);

router.get('/', authMiddleware.authenticate,getWholesalers);

module.exports = router;
