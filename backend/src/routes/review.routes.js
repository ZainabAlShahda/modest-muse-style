const express = require('express');
const router = express.Router();
const { getProductReviews, createReview, deleteReview } = require('../controllers/review.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/:productId', getProductReviews);
router.post('/:productId', protect, createReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
