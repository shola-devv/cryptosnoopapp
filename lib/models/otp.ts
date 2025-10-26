import { Schema, model, models } from "mongoose";

const OtpSchema = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // Auto-delete after 5 minutes
});

const Otp = models.Otp || model("Otp", OtpSchema);

export default Otp;