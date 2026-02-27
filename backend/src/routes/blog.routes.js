const express = require('express');
const router = express.Router();
const { getPosts, getPost, createPost, updatePost, deletePost } = require('../controllers/blog.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

router.get('/', getPosts);
router.get('/:slug', getPost);
router.post('/', protect, restrictTo('admin'), createPost);
router.put('/:slug', protect, restrictTo('admin'), updatePost);
router.delete('/:slug', protect, restrictTo('admin'), deletePost);

module.exports = router;
