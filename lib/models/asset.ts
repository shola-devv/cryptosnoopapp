import { Schema, model, models } from "mongoose";

const AssetSchema = new Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    lastPrice: { type: Number, required: true, default: 0 },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

const Asset = models.Asset || model("Asset", AssetSchema);

export default Asset;