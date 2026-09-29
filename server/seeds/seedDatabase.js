import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Store from '../models/Store.js';
import Product from '../models/Product.js';
import Complaint from '../models/Complaint.js';
import EmergencyContact from '../models/EmergencyContact.js';
import CommunityEvent from '../models/CommunityEvent.js';
import { 
  initialStores, 
  initialProducts, 
  initialComplaints, 
  initialEmergencyContacts, 
  initialCommunityEvents 
} from './seedData.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      console.error('❌ MONGO_URI is missing in .env file!');
      process.exit(1);
    }

    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully!');

    // Clear existing data
    await Promise.all([
      User.deleteMany(),
      Store.deleteMany(),
      Product.deleteMany(),
      Complaint.deleteMany(),
      EmergencyContact.deleteMany(),
      CommunityEvent.deleteMany()
    ]);
    console.log('🧹 Cleared existing collections');

    // Create Demo Users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    await User.insertMany([
      { name: 'Aditya Rakesh', email: 'aditya@example.com', password: hashedPassword, role: 'citizen', phone: '9876543210' },
      { name: 'Ramesh Sharma', email: 'ramesh@sharmadhaba.com', password: hashedPassword, role: 'vendor', phone: '9871122334' },
      { name: 'Mukhiya Ji', email: 'admin@rampurpanchayat.gov.in', password: hashedPassword, role: 'admin', phone: '9998887776' }
    ]);
    console.log('👤 Created demo users');

    // Insert Stores and keep track of mapping from string ID to ObjectId
    const storeIdMap = {};
    for (const store of initialStores) {
      const { id, ...storeData } = store;
      const newStore = await Store.create(storeData);
      storeIdMap[id] = newStore._id;
    }
    
    // Insert Products with mapped storeId
    const mappedProducts = initialProducts.map(product => {
      const { id, storeId, ...productData } = product;
      return {
        ...productData,
        storeId: storeIdMap[storeId] || null
      };
    });
    await Product.insertMany(mappedProducts);

    // Insert others without specific ID dependencies
    const complaintsWithoutId = initialComplaints.map(({ id, ...rest }) => rest);
    await Complaint.insertMany(complaintsWithoutId);

    const contactsWithoutId = initialEmergencyContacts.map(({ id, ...rest }) => rest);
    await EmergencyContact.insertMany(contactsWithoutId);

    const eventsWithoutId = initialCommunityEvents.map(({ id, ...rest }) => rest);
    await CommunityEvent.insertMany(eventsWithoutId);
    
    console.log('🌱 Seeded Stores, Products, Complaints, Emergency Contacts, and Events');

    console.log('🎉 Database seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
