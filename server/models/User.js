import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email or phone identifier'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required for rural notifications'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['citizen', 'vendor', 'admin'],
      default: 'citizen',
    },
    village: {
      type: String,
      default: 'Rampur Panchayat',
    },
    storeName: {
      type: String,
      default: null,
    },
    storeCategory: {
      type: String,
      enum: ['restaurant', 'grocery', 'pharmacy', 'agro', null],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model('User', userSchema);
