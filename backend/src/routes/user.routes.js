const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, addToWishlist, removeFromWishlist } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/wishlist/:productId', protect, addToWishlist);
router.delete('/wishlist/:productId', protect, removeFromWishlist);

module.exports = router;
