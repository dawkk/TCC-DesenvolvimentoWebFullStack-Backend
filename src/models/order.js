import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  deliveryAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'addresses',
    required: true,
  },
  cartItems: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'orderItems' }
  ],
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'orderStatus',
    required: true
  },
  totalAmount: { type: Number },
  paymentMethod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'paymentMethods',
    required: true,
  },
  dateOrdered: {
    type: Date,
    default: Date.now,
  },
},
  { timestamps: true });

const orders = mongoose.model('orders', orderSchema);

export default orders;