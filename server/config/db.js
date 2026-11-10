import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/communitycart';
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
    
    // Check limits after connection
    setTimeout(checkAtlasLimits, 3000);
  } catch (error) {
    console.warn(`[MongoDB] Local/Cloud MongoDB not connected (${error.message}).`);
    console.log(`[MongoDB Fallback] Running with in-memory resilient mock database for Phase 1!`);
    isConnected = false;
  }
};

export const getDBStatus = () => isConnected;

export const checkAtlasLimits = async () => {
  if (!isConnected || !mongoose.connection.db) return;
  try {
    const stats = await mongoose.connection.db.stats();
    const dataSizeMB = (stats.dataSize || 0) / (1024 * 1024);
    const storageSizeMB = (stats.storageSize || 0) / (1024 * 1024);
    const actualSizeMB = Math.max(dataSizeMB, storageSizeMB);

    // Free Tier Limit is 512MB. Alert when above 450MB.
    if (actualSizeMB > 450) {
      console.log('\n====================================================');
      console.log('⚠️  ATLAS STORAGE ALERT: Free Tier Limits Approaching!');
      console.log(`⚠️  Current Estimated Size: ${actualSizeMB.toFixed(2)} MB / 512 MB`);
      console.log('⚠️  Please UPGRADE YOUR CLUSTER in the MongoDB Atlas dashboard');
      console.log('⚠️  to seamlessly switch to your $50 promotional credit.');
      console.log('====================================================\n');
    }
  } catch (err) {
    console.error('Failed to fetch Atlas DB stats:', err.message);
  }

  // Credit Expiration Reminder
  const expiryDate = new Date('2027-10-09');
  const today = new Date();
  const reminderDate = new Date('2027-09-09'); // 1 month before expiry

  if (today > reminderDate && today < expiryDate) {
    console.log('\n====================================================');
    console.log('⏰ ATLAS CREDIT REMINDER: Your $50 credit expires soon!');
    console.log('⏰ Expiry Date: October 9, 2027');
    console.log('====================================================\n');
  } else if (today >= expiryDate) {
    console.log('\n====================================================');
    console.log('❌ ATLAS CREDIT REMINDER: Your $50 promotional credit has EXPIRED.');
    console.log('====================================================\n');
  }
};
