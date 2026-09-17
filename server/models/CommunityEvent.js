import mongoose from 'mongoose';

const communityEventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Health Camp', 'Blood Donation', 'Farmer Workshop', 'Panchayat Meet', 'Cultural/Festive'],
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    organizer: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    attendeesCount: {
      type: Number,
      default: 0,
    },
    isFree: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.CommunityEvent || mongoose.model('CommunityEvent', communityEventSchema);
