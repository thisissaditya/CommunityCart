import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Roads & Transport', 'Water Supply', 'Electricity', 'Sanitation & Waste', 'Healthcare', 'Public Safety'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    village: {
      type: String,
      default: 'Rampur Panchayat',
    },
    citizenName: {
      type: String,
      required: true,
    },
    citizenPhone: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved'],
      default: 'Pending',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    assignedOfficer: {
      type: String,
      default: 'Panchayat Seva Officer',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Complaint || mongoose.model('Complaint', complaintSchema);
