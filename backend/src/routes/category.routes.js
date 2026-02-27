const express = require('express');
const router = express.Router();
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/category.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

router.get('/', getCategories);
router.post('/', protect, restrictTo('admin'), createCategory);
router.put('/:id', protect, restrictTo('admin'), updateCategory);
router.delete('/:id', protect, restrictTo('admin'), deleteCategory);

module.exports = router;
