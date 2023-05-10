import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'orders',
  },
  dishId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'dishes',
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
},
{ timestamps: true });

const orderItems = mongoose.model('orderItems', orderItemSchema);

export default orderItems;