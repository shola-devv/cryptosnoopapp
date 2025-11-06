import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, default: "user" },
    password: { 
      type: String, 
      required: false,  // Make optional for OAuth users
      default: null 
    },
    profile: { type: Number, default: 0  },
    provider: { 
      type: String, 
      enum: ['google', 'email'], 
      required: true 
    },
    
    image: { type: String, required: true, default: null },
    subscription: {
      id: { type: String, default: "" },
      status: { type: String, default: "free" },
      plan: { type: String, default: "free" },
    },
  },
  {
    timestamps: true,
  }
);

// Log when model is created
console.log("📊 [User Model] Initialized");

const User = models.User || model("User", UserSchema);

export default User;