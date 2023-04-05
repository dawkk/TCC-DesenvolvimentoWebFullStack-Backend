import mongoose from "mongoose";

const orderStatusSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    enum: ['pending', 'accepted', 'rejected', 'delivered'],
    unique: true
  }
});

const orderStatus = mongoose.model('orderStatus', orderStatusSchema);

export default orderStatus;