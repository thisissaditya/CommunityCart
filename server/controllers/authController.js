import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getDBStatus } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'community_cart_dev_jwt_secret_key_2026';

// In-memory demo users store for resilient fallback
let demoUsers = [
  {
    id: 'user-1',
    name: 'Aditya Rakesh',
    email: 'aditya@example.com',
    phone: '9876543210',
    role: 'citizen',
    village: 'Rampur Panchayat',
  },
  {
    id: 'user-2',
    name: 'Ramesh Sharma (Mess Owner)',
    email: 'ramesh@sharmadhaba.com',
    phone: '9871122334',
    role: 'vendor',
    village: 'Rampur Panchayat',
    storeName: 'Sharma Ji Ka Mess & Dhaba',
    storeCategory: 'restaurant',
  },
  {
    id: 'user-3',
    name: 'Dr. Alok Verma (Chemist)',
    email: 'alok@janaushadhi.org',
    phone: '9833344556',
    role: 'vendor',
    village: 'Rampur Panchayat',
    storeName: 'Jan Aushadhi & Gramin Medical Store',
    storeCategory: 'pharmacy',
  },
  {
    id: 'user-4',
    name: 'Mukhiya Ji / Admin',
    email: 'admin@rampurpanchayat.gov.in',
    phone: '9412356789',
    role: 'admin',
    village: 'Rampur Panchayat',
  },
];

export const register = async (req, res) => {
  try {
    const { name, email, phone, password, role = 'citizen', village = 'Rampur Panchayat', storeName, storeCategory } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and phone' });
    }

    if (getDBStatus()) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists' });
      }

      const user = await User.create({
        name,
        email,
        phone,
        password: password || 'password123',
        role,
        village,
        storeName: storeName || null,
        storeCategory: storeCategory || null,
      });

      const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          village: user.village,
          storeName: user.storeName,
          storeCategory: user.storeCategory,
        },
      });
    }

    // In-memory fallback
    const existing = demoUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone,
      role,
      village,
      storeName: storeName || null,
      storeCategory: storeCategory || null,
    };
    demoUsers.push(newUser);

    const token = jwt.sign({ id: newUser.id, role: newUser.role, name: newUser.name }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      token,
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email or phone number' });
    }

    if (getDBStatus()) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials or user not found' });
      }

      const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          village: user.village,
          storeName: user.storeName,
          storeCategory: user.storeCategory,
        },
      });
    }

    // In-memory fallback
    let user = demoUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      // Auto-create or pick demo user for testing ease if matching role
      if (role) {
        user = demoUsers.find((u) => u.role === role) || demoUsers[0];
      } else {
        user = {
          id: `user-${Date.now()}`,
          name: email.split('@')[0],
          email,
          phone: '9876500000',
          role: role || 'citizen',
          village: 'Rampur Panchayat',
        };
        demoUsers.push(user);
      }
    }

    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDemoAccounts = (req, res) => {
  res.json({
    success: true,
    accounts: demoUsers,
  });
};
