import mongoose from 'mongoose';

const emergencyContactSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    serviceType: {
      type: String,
      enum: ['Medical', 'Police', 'Disaster', 'Gram Panchayat', 'Animal Care'],
      default: 'Medical',
    },
    is24x7: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.EmergencyContact || mongoose.model('EmergencyContact', emergencyContactSchema);
