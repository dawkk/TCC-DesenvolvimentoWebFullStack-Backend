import mongoose from "mongoose";

const dishSchema = new mongoose.Schema({
  id: {type: String},
  title: {type: String, required: true},
  description: {type: String},
  price: {type: Number},
  menu: {type: mongoose.Schema.Types.ObjectId, ref:'menus', required: true},
  type: {type: String},
  image: {type: String}
});

const dishes = mongoose.model('dishes', dishSchema);

export default dishes;