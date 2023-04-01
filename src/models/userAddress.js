import mongoose from "mongoose";

const userAddressSchema = new mongoose.Schema({
  id: { type: Number },
  userId: { type: String, required: true },
  city: { type: String },
  state: { type: String },
  neighborhood: { type: String },
  street: { type: String },
  number: { type: Number },
  zipcode: { type: Number },
  status: { type: Boolean }
});

const addresses = mongoose.model('addresses', userAddressSchema);

export default addresses;