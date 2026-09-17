import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: false,
    },
    storeName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['food', 'grocery', 'pharmacy', 'agro'],
      required: true,
    },
    subcategory: {
      type: String,
      default: 'General',
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      default: '1 item',
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    isVeg: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Product || mongoose.model('Product', productSchema);
