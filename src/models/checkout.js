import mongoose from "mongoose";

const checkoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
    unique: true
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
  totalAmount: { type: Number },
  paymentMethod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'paymentMethods',
  },
  expiresAt: {
    type: Date,
    expires: 60 * 60 * 24, // Expire after 24 hours
    default: Date.now,
  },
},
{ timestamps: true });

const checkouts = mongoose.model('checkouts', checkoutSchema);

export default checkouts;
