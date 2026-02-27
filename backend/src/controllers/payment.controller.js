const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const ApiError = require('../utils/ApiError');
const { sendResponse } = require('../utils/ApiResponse');

exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { amount, currency = 'usd', orderId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert to cents
      currency,
      metadata: { orderId: orderId?.toString() || '' },
    });

    sendResponse(res, { data: { clientSecret: paymentIntent.client_secret } });
  } catch (err) {
    next(err);
  }
};

/**
 * JazzCash — initiate mobile-wallet payment request.
 * In production: call the JazzCash REST API, get a txnRefNo back.
 */
exports.jazzCashPayment = async (req, res, next) => {
  try {
    const { mobileNumber, amount } = req.body;

    if (!mobileNumber || !/^03\d{9}$/.test(mobileNumber)) {
      return next(new ApiError('Invalid JazzCash mobile number.', 400));
    }
    if (!amount || amount <= 0) {
      return next(new ApiError('Invalid payment amount.', 400));
    }

    // TODO: Replace with live JazzCash MIGS / REST API call.
    // For now return a simulated pending transaction reference.
    const txnRefNo = `JC-${Date.now()}`;

    sendResponse(res, {
      message: 'JazzCash payment request initiated. Awaiting confirmation on your mobile.',
      data: { txnRefNo, status: 'pending' },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * EasyPaisa — initiate OTP-based payment.
 * In production: call the EasyPaisa Pay with OTP API.
 */
exports.easyPaisaPayment = async (req, res, next) => {
  try {
    const { mobileNumber, amount } = req.body;

    if (!mobileNumber || !/^03\d{9}$/.test(mobileNumber)) {
      return next(new ApiError('Invalid EasyPaisa mobile number.', 400));
    }
    if (!amount || amount <= 0) {
      return next(new ApiError('Invalid payment amount.', 400));
    }

    // TODO: Replace with live EasyPaisa API call.
    const transactionId = `EP-${Date.now()}`;

    sendResponse(res, {
      message: 'EasyPaisa payment request initiated. Check your phone for the OTP.',
      data: { transactionId, status: 'pending' },
    });
  } catch (err) {
    next(err);
  }
};

exports.handleWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object;
    const orderId = pi.metadata?.orderId;
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        isPaid: true,
        paidAt: new Date(),
        status: 'processing',
        paymentResult: { id: pi.id, status: pi.status, receiptUrl: pi.charges?.data[0]?.receipt_url },
      });
    }
  }

  res.json({ received: true });
};
