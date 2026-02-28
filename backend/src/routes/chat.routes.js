const express = require('express');
const rateLimit = require('express-rate-limit');
const { chatWithAgent } = require('../controllers/chat.controller');

const router = express.Router();

// Tighter rate limit for AI chat to control LLM costs (20 messages/minute per IP)
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many messages. Please wait a moment before continuing.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', chatLimiter, chatWithAgent);

module.exports = router;
