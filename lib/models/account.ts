import { Schema, model, models } from "mongoose";

const AccountSchema = new Schema(
  {
    address: { type: String, required: true },
    data: { type: [Schema.Types.Mixed], default: [] },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

const Account = models.Account || model("Account", AccountSchema);

export default Account;