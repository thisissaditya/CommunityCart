import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Store from './models/Store.js';
import Product from './models/Product.js';

dotenv.config();

const addFood = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully!');

    // Find the store
    let store = await Store.findOne({ name: { $regex: /sharma/i } });
    
    // If not found, let's create it since the user might be referring to a fresh DB
    if (!store) {
      console.log('Store not found. Creating "Sharmaji Ka Dhaba"...');
      store = await Store.create({
        name: 'Sharmaji Ka Dhaba',
        category: 'food',
        ownerName: 'Ramesh Sharma',
        phone: '9871122334',
        village: 'Rampur Panchayat',
        address: 'Highway Road, Rampur',
        rating: 4.6,
        isOpen: true
      });
    }

    // Add a food item
    const newFood = await Product.create({
      name: 'Paneer Butter Masala',
      storeId: store._id,
      storeName: store.name,
      category: 'food',
      subcategory: 'Main Course',
      price: 150,
      originalPrice: 180,
      unit: '1 plate',
      description: 'Rich and creamy paneer curry cooked in butter and tomato gravy',
      inStock: true,
      isVeg: true
    });

    console.log(`🍔 Successfully added "${newFood.name}" to ${store.name}!`);

    console.log('🎉 Update completed successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error adding food:', error);
    process.exit(1);
  }
};

addFood();
