const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/product.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

router.get('/', getProducts);
router.get('/:slug', getProduct);
router.post('/', protect, restrictTo('admin'), createProduct);
router.put('/:slug', protect, restrictTo('admin'), updateProduct);
router.delete('/:slug', protect, restrictTo('admin'), deleteProduct);

module.exports = router;
