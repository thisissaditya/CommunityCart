import Complaint from '../models/Complaint.js';
import { initialComplaints } from '../seeds/seedData.js';
import { getDBStatus } from '../config/db.js';

let complaintsCache = [...initialComplaints];

export const getComplaints = async (req, res) => {
  try {
    const { status, category, village } = req.query;

    if (getDBStatus()) {
      const query = {};
      if (status && status !== 'All') query.status = status;
      if (category && category !== 'All') query.category = category;
      if (village) query.village = village;
      const complaints = await Complaint.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: complaints.length, complaints });
    }

    let result = [...complaintsCache];
    if (status && status !== 'All') {
      result = result.filter((c) => c.status.toLowerCase() === status.toLowerCase());
    }
    if (category && category !== 'All') {
      result = result.filter((c) => c.category.toLowerCase() === category.toLowerCase());
    }
    if (village && village !== 'All') {
      result = result.filter((c) => c.village.toLowerCase().includes(village.toLowerCase()));
    }

    res.json({ success: true, count: result.length, complaints: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createComplaint = async (req, res) => {
  try {
    const { title, category, description, location, citizenName, citizenPhone, village, priority } = req.body;

    if (!title || !category || !description || !location) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (getDBStatus()) {
      const complaint = await Complaint.create({
        title,
        category,
        description,
        location,
        citizenName: citizenName || 'Anonymous Citizen',
        citizenPhone: citizenPhone || '9876543210',
        village: village || 'Rampur Panchayat',
        priority: priority || 'Medium',
        status: 'Pending',
        assignedOfficer: 'Gram Panchayat Officer',
      });
      return res.status(201).json({ success: true, complaint });
    }

    const complaint = {
      id: `cmp-${Date.now()}`,
      title,
      category,
      description,
      location,
      citizenName: citizenName || 'Aditya Rakesh',
      citizenPhone: citizenPhone || '+91 98765 43210',
      village: village || 'Rampur Panchayat',
      status: 'Pending',
      priority: priority || 'Medium',
      assignedOfficer: 'Panchayat Helpdesk Lineman',
      createdAt: new Date().toISOString(),
    };

    complaintsCache.unshift(complaint);
    res.status(201).json({ success: true, complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedOfficer } = req.body;

    if (getDBStatus()) {
      const complaint = await Complaint.findById(id);
      if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
      if (status) complaint.status = status;
      if (assignedOfficer) complaint.assignedOfficer = assignedOfficer;
      await complaint.save();
      return res.json({ success: true, complaint });
    }

    const complaint = complaintsCache.find((c) => c.id === id);
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
    if (status) complaint.status = status;
    if (assignedOfficer) complaint.assignedOfficer = assignedOfficer;

    res.json({ success: true, complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
