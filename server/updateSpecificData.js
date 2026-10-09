import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Store from './models/Store.js';
import Product from './models/Product.js';

dotenv.config();

const updateData = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully!');

    // Update Alice Smith to Purshottam Rakesh
    await User.findOneAndUpdate(
      { email: 'alice@example.com' },
      { name: 'Purshottam Rakesh' }
    );
    console.log('👤 Updated user: Alice Smith -> Purshottam Rakesh');

    // Update Bob Vendor to Aditya Raj
    await User.findOneAndUpdate(
      { email: 'bob@example.com' },
      { name: 'Aditya Raj' }
    );
    console.log('👤 Updated user: Bob Vendor -> Aditya Raj');

    // Update Store name
    const store = await Store.findOneAndUpdate(
      { name: 'Bob Food Corner' },
      { name: 'Apna Dhaba', ownerName: 'Aditya Raj' },
      { new: true }
    );
    console.log('🏪 Updated store: Bob Food Corner -> Apna Dhaba');

    // If there's store name stored in Products, update it as well
    if (store) {
      await Product.updateMany(
        { storeId: store._id },
        { storeName: 'Apna Dhaba' }
      );
      console.log('🍔 Updated Food Menu store names');
    }

    console.log('🎉 Data updated successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error updating data:', error);
    process.exit(1);
  }
};

updateData();
