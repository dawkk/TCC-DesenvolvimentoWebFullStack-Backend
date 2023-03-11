import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String },
  orderedItems: [
    { 
      dishId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'dishes',
      },
      quantity: {
        type: Number,
        default: 1,
      }
    }
  ],
  status: {
    type: String,
    required: true,
    default: 'Pending',
  },
  totalPrice: { type: Number },
  dateOrdered: {
    type: Date,
    default: Date.now,
  },
},
  { timestamps: true }
);

const orders = mongoose.model('orders', orderSchema);

export default orders;