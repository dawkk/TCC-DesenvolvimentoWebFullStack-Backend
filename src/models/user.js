import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {type: String, required: true},
  lastName: {type: String},
  email: {type: String, required: true},
  password:{type: String, required: true},
  /* address: {type: mongoose.Schema.Types.ObjectId, ref:'adresses', required: true}, */
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

const users = mongoose.model('users', userSchema);

export default users;