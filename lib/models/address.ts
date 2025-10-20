import { Schema, model, models } from "mongoose";

const AddressSchema = new Schema(
  {
    address: { type: String, required: true },
    label: { type: String, required: true },
    category: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

const Address = models.Address || model("Address", AddressSchema);

export default Address;