const Order = require('../models/Order');
const ApiError = require('../utils/ApiError');
const { sendResponse } = require('../utils/ApiResponse');
const { paginate, paginateMeta } = require('../utils/pagination');

exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice, guestEmail } = req.body;

    const order = await Order.create({
      user: req.user?._id,
      guestEmail,
      items,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    sendResponse(res, { statusCode: 201, message: 'Order placed successfully', data: order });
  } catch (err) {
    next(err);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { skip, limit: lim, page: pageNum } = paginate(null, page, limit);
    const [orders, total] = await Promise.all([
      Order.find({ user: req.user._id }).sort({ createdAt: -1 }).skip(skip).limit(lim).lean(),
      Order.countDocuments({ user: req.user._id }),
    ]);
    sendResponse(res, { data: orders, meta: paginateMeta(total, pageNum, lim) });
  } catch (err) {
    next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return next(new ApiError('Order not found', 404));
    if (order.user?._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new ApiError('Access denied', 403));
    }
    sendResponse(res, { data: order });
  } catch (err) {
    next(err);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const { skip, limit: lim, page: pageNum } = paginate(null, page, limit);
    const filter = status ? { status } : {};
    const [orders, total] = await Promise.all([
      Order.find(filter).populate('user', 'name email').sort({ createdAt: -1 }).skip(skip).limit(lim).lean(),
      Order.countDocuments(filter),
    ]);
    sendResponse(res, { data: orders, meta: paginateMeta(total, pageNum, lim) });
  } catch (err) {
    next(err);
  }
};

// Public order tracking — requires order number + email (no auth token needed)
exports.trackOrder = async (req, res, next) => {
  try {
    const { orderNumber, email } = req.body;
    if (!orderNumber || !email) {
      return next(new ApiError('Order number and email are required', 400));
    }

    const order = await Order.findOne({ orderNumber: orderNumber.trim().toUpperCase() })
      .select('orderNumber status isPaid isDelivered items shippingAddress paymentMethod itemsPrice shippingPrice taxPrice totalPrice createdAt paidAt deliveredAt user guestEmail')
      .lean();

    if (!order) return next(new ApiError('Order not found. Please check your order number.', 404));

    // Verify the email matches the order
    const orderEmail = order.guestEmail || null;
    // For logged-in orders we'd need to populate user — do a separate lookup
    let matchEmail = false;
    if (order.guestEmail && order.guestEmail.toLowerCase() === email.toLowerCase()) {
      matchEmail = true;
    } else if (order.user) {
      const User = require('../models/User');
      const user = await User.findById(order.user).select('email').lean();
      if (user && user.email.toLowerCase() === email.toLowerCase()) matchEmail = true;
    }

    if (!matchEmail) {
      return next(new ApiError('Order not found. Please check your order number and email.', 404));
    }

    sendResponse(res, { data: order });
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
        ...(status === 'delivered' && { isDelivered: true, deliveredAt: new Date() }),
      },
      { new: true }
    );
    if (!order) return next(new ApiError('Order not found', 404));
    sendResponse(res, { message: 'Order status updated', data: order });
  } catch (err) {
    next(err);
  }
};
