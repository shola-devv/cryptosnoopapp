import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "";

// Configure mongoose for better connection handling
mongoose.set('strictQuery', false);

// Connection options
const options = {
  bufferCommands: false, // Disable buffering
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of 30s
  socketTimeoutMS: 45000,
  family: 4, // Use IPv4, skip trying IPv6
};

let isConnected = false;

const connect = async () => {
  // Ensure MONGO_URI is present when attempting to connect. We avoid throwing
  // at import time so server-side builds or preview environments without a
  // configured DB don't crash during static analysis.
  if (!MONGO_URI) {
    throw new Error('MONGO_URI is not configured. Set MONGO_URI in environment to connect to MongoDB.');
  }
  // If already connected, return immediately
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log("✅ Using existing MongoDB connection");
    return mongoose.connection;
  }

  // If currently connecting, wait for it
  if (mongoose.connection.readyState === 2) {
    console.log("⏳ MongoDB connection in progress...");
    // Wait for the connection to complete
    await new Promise((resolve) => {
      mongoose.connection.once('connected', resolve);
    });
    return mongoose.connection;
  }

  try {
    console.log("🔄 Creating new MongoDB connection...");
    
    await mongoose.connect(MONGO_URI!, {
      dbName: "cryptosnoop",
      ...options,
    });

    isConnected = true;
    console.log("✅ MongoDB connected successfully");

    // Handle connection events
    mongoose.connection.on('connected', () => {
      isConnected = true;
      console.log('✅ Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ Mongoose disconnected');
      isConnected = false;
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

    return mongoose.connection;
  } catch (err: any) {
    console.error("❌ MongoDB connection error:", err);
    isConnected = false;
    throw new Error(`Failed to connect to MongoDB: ${err.message}`);
  }
};

export default connect;