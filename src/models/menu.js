import mongoose from "mongoose";
import dishes from "./dish.js";

const menuSchema = new mongoose.Schema(
  {
    name: {type: String, required: true, unique:true},
    image: { type: String }
  }
);

const menus = mongoose.model('menus', menuSchema)

const updateDishes = async () => {
  const docs = await menus.find({});
  if (docs.length > 0) {
    await dishes.updateMany({}, { $set: { menu: docs[0]._id } });
  }
};

const updateMenus = async () => {
  try {
    const count = await menus.countDocuments({});
    if (count === 0) {
      const initialMenus = [
        {
          name: "Entrada"
        },
        {
          name: "Prato Principal"
        },
        {
          name: "Sobremesa"
        },
        {
          name: "Menu Kids"
        }
      ];
      const docs = await menus.insertMany(initialMenus);
      console.log(`${docs.length} menus were successfully inserted into the database.`);
    }
    await updateDishes();
  } catch (error) {
    console.error(error);
  }
};

updateMenus();
console.log(updateMenus)


export default menus;