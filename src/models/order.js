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
    {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
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