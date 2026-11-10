import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  unit: {
    type: String,
    default: '1 item',
  },
  category: {
    type: String,
    default: 'food',
  },
  isVeg: {
    type: Boolean,
    default: true,
  },
  image: {
    type: String,
  },
});

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  note: {
    type: String,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
      village: { type: String, required: true, default: 'Rampur Panchayat' },
    },
    storeId: {
      type: String,
      default: 'store-1',
    },
    storeName: {
      type: String,
      required: true,
      default: 'Sharma Ji Ka Mess & Dhaba',
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    platformFee: {
      type: Number,
      default: 2,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Placed', 'Accepted', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Placed',
    },
    statusHistory: [statusHistorySchema],
    prescriptionUrl: {
      type: String,
      default: null,
    },
    paymentMethod: {
      type: String,
      enum: ['Cash on Delivery', 'UPI on Delivery'],
      default: 'Cash on Delivery',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed'],
      default: 'Pending',
    },
    smsNotification: {
      sent: { type: Boolean, default: true },
      lastMessage: { type: String },
      recipientPhone: { type: String },
      timestamp: { type: Date, default: Date.now },
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;

