import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['food', 'grocery', 'pharmacy', 'services'],
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    ownerName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    village: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    deliveryTime: {
      type: String,
      default: '20-30 mins',
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    minOrder: {
      type: Number,
      default: 50,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      default: '',
    },
    featuredBadge: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Store || mongoose.model('Store', storeSchema);
