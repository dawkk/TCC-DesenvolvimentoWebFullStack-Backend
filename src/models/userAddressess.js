import mongoose from "mongoose";

const userAddressessSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  city: { type: String },
  state: { type: String },
  neighborhood: { type: String },
  street: { type: String },
  number: { type: Number },
  zipcode: { type: String },
  additionalInfo: { type: String },
  mainAddress: { type: Boolean, default: false },
  statusActive:{ type: Boolean, default:true }
},
{ timestamps: true });

const addresses = mongoose.model('addresses', userAddressessSchema);

export default addresses;