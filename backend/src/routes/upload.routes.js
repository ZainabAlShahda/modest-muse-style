const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadImage, deleteImage } = require('../controllers/upload.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'), false);
  },
});

router.post('/image', protect, restrictTo('admin'), upload.single('image'), uploadImage);
router.delete('/image', protect, restrictTo('admin'), deleteImage);

module.exports = router;
