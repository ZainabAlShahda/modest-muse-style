const express = require('express');
const router = express.Router();
const { createPaymentIntent, jazzCashPayment, easyPaisaPayment, handleWebhook } = require('../controllers/payment.controller');
const { optionalProtect } = require('../middleware/auth.middleware');

// Webhook needs raw body — must come before express.json() parses it
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Card payment (Stripe) — guests and logged-in users
router.post('/create-intent', optionalProtect, createPaymentIntent);

// Mobile wallets (guests allowed — auth optional)
router.post('/jazzcash',   jazzCashPayment);
router.post('/easypaisa',  easyPaisaPayment);

module.exports = router;
