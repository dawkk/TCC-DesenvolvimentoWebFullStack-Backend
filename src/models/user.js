import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {type: String, required: true},
  lastName: {type: String},
  email: {type: String, required: true},
  password:{type: String, required: true},
  cellphone:{type:String},
  addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'addresses' }],
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