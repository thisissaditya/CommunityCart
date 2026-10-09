import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Store from './models/Store.js';
import Product from './models/Product.js';

dotenv.config();

const addData = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully!');

    // Create 2 Users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    await User.insertMany([
      { name: 'Alice Smith', email: 'alice@example.com', password: hashedPassword, role: 'citizen', phone: '1112223334' },
      { name: 'Bob Vendor', email: 'bob@example.com', password: hashedPassword, role: 'vendor', phone: '5556667778' }
    ]);
    console.log('👤 Added 2 users: Alice and Bob');

    // Create a Store for the food menu
    const newStore = await Store.create({
      name: 'Bob Food Corner',
      category: 'food',
      ownerName: 'Bob Vendor',
      phone: '5556667778',
      village: 'Rampur Panchayat',
      address: 'Main Street, Rampur',
      rating: 4.8,
      isOpen: true
    });
    console.log('🏪 Added store: Bob Food Corner');

    // Add Food Menu (Products)
    await Product.insertMany([
      {
        name: 'Samosa',
        storeId: newStore._id,
        storeName: newStore.name,
        category: 'food',
        subcategory: 'Snacks',
        price: 15,
        originalPrice: 20,
        unit: '2 pieces',
        description: 'Hot and crispy samosas with chutney',
        inStock: true,
        isVeg: true
      },
      {
        name: 'Veg Thali',
        storeId: newStore._id,
        storeName: newStore.name,
        category: 'food',
        subcategory: 'Meals',
        price: 80,
        originalPrice: 100,
        unit: '1 plate',
        description: 'Complete meal with dal, roti, sabzi, and rice',
        inStock: true,
        isVeg: true
      },
      {
        name: 'Masala Dosa',
        storeId: newStore._id,
        storeName: newStore.name,
        category: 'food',
        subcategory: 'South Indian',
        price: 60,
        originalPrice: 70,
        unit: '1 plate',
        description: 'Crispy dosa filled with potato masala',
        inStock: true,
        isVeg: true
      }
    ]);
    console.log('🍔 Added Food Menu');

    console.log('🎉 Data added successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error adding data:', error);
    process.exit(1);
  }
};

addData();
