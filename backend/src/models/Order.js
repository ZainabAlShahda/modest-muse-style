const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: String,
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  size: String,
  color: String,
  sku: String,
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: String,
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: String,
  postalCode: { type: String, required: true },
  country: { type: String, required: true, default: 'US' },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    guestEmail: String,
    orderNumber: { type: String, unique: true },
    items: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentMethod: { type: String, default: 'stripe' },
    paymentResult: {
      id: String,
      status: String,
      updateTime: String,
      receiptUrl: String,
    },
    itemsPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    taxPrice: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
      default: 'pending',
    },
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    isDelivered: { type: Boolean, default: false },
    deliveredAt: Date,
    notes: String,
  },
  { timestamps: true }
);

// Auto-generate order number before save
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `MMS-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
