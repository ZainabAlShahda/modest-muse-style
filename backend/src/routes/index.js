const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/products', require('./product.routes'));
router.use('/categories', require('./category.routes'));
router.use('/orders', require('./order.routes'));
router.use('/users', require('./user.routes'));
router.use('/blog', require('./blog.routes'));
router.use('/upload', require('./upload.routes'));
router.use('/payment', require('./payment.routes'));
router.use('/reviews', require('./review.routes'));
router.use('/chat', require('./chat.routes'));

module.exports = router;
