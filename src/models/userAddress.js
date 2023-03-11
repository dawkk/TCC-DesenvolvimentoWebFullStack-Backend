import mongoose from "mongoose";

const userAddressSchema = new mongoose.Schema({
  id: {type: Number},
  firstName: {type: String, required: true},
  lastName: {type: String},
  email: {type: String, required: true},
  password:{type: String, required: true},
  address: {
    city: {type: String},
    state: {type: String},
    neighborhood: {type: String},
    street: {type: String},
    number: {type: Number},
    zipcode: {type: Number}

  },
  roles: {
    User: {
      type:Number,
      default:4000
    },
    Employee: {type: Number},
    Editor: {type: Number},
    Admin: { type: Number}
  },
  refreshToken: {type: String},
  status: {type: Boolean}
});

const addresses = mongoose.model('addresses', userSchema);

export default users;