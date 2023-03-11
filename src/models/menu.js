import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    name: {type: String, required: true}
  }
);

const menus = mongoose.model('menus', menuSchema)

export default menus;