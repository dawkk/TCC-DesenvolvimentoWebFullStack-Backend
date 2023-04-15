import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    name: {type: String, required: true, unique:true},
    image: { type: String }
  }
);

const menus = mongoose.model('menus', menuSchema)

menus.countDocuments({}, async (error, count) => {
  if (error) {
    console.error(error);
  } else {
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
          name: "Lanches"
        }
      ];
      
      menus.insertMany(initialMenus, (error, docs) => {
        if (error) {
          console.error(error);
        } else {
          console.log(`${docs.length} menus were successfully inserted into the database.`);
        }
      });
    }
  }
});

export default menus;

/* const updateMenus = async () => {
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
    console.log(updateMenus)
  } catch (error) {
    console.error(error);
  }
};
 */