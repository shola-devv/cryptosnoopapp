import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // Optional for OAuth users
    profile: { type: Number, required: true, default: 0 },
    provider: { type: String, enum: ['google', 'email'], required: true }, // Track auth method
    image: { type: String }, // For Google profile picture
    subscription: {
      id: String,
      status: String,
      plan: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = models.User || model("User", UserSchema);

export default User;