import { Schema, model, models, connection } from "mongoose";
import mongoose from "mongoose";

const OtpSchema = new Schema({
  email: { 
    type: String, 
    required: true,
    lowercase: true,
    trim: true
  },
  otp: { 
    type: String, 
    required: true,
    trim: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
    index: { expires: 0 } // MongoDB will delete when expiresAt is reached
  }
});

// Create compound index for faster lookups
OtpSchema.index({ email: 1, otp: 1 });

// Log which database we're using
if (connection.readyState === 1) {
  console.log("📊 [OTP Model] Using database:", connection.db?.databaseName);
}

// Ensure the model is only created once
const Otp = mongoose.models.Otp || mongoose.model("Otp", OtpSchema);

export default Otp