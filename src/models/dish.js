import mongoose from "mongoose";
import menus from "./menu.js";

const dishSchema = new mongoose.Schema({
  id: { type: String },
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number },
  menu: { type: mongoose.Schema.Types.ObjectId, ref: 'menus', required: true },
  type: { type: String },
  image: { type: String }
});

const dishes = mongoose.model('dishes', dishSchema);

dishes.countDocuments({}, async (error, count) => {
  if (error) {
    console.error(error);
  } else {
    if (count === 0) {
      const initialDishes = [
        {
          title: "Salada Simples",
          description: "Alface americana, croutons crocantes, tomates-cereja frescos, parmesão ralado e molho ceasar.",
          price: 25,
          menu: "Entrada",
          image: "image-1679521233614.jpg"
        },
        {
          title: "Risoto de Frutos do Mar",
          description: "Arroz arbóreo com camarão, lula, polvo e mariscos, temperados com azeite, alho, tomate e ervas.",
          price: 58,
          menu: "Prato Principal",
          image: "image-1679521249097.jpg"
        },
        {
          title: "Churrasco Misto",
          description: "Seleção de carnes grelhadas, incluindo picanha, alcatra, fraldinha, linguiça e coração de frango, servida com farofa, vinagrete e pão de alho.",
          price: 80,
          menu: "Prato Principal",
          image: "image-1679521263264.jpg"
        },
        {
          title: "Yakissoba ",
          description: "Macarrão frito com legumes, cogumelos, carne bovina e frango, em molho à base de shoyu e óleo de gergelim.",
          price: 39.9,
          menu: "Prato Principal",
          image: "image-1679521279980.jpg"
        },
        {
          title: "Ceviche de Salmão",
          description: "Cubos de salmão marinados em suco de limão, temperados com coentro, rabanetes finos e pimenta dedo-de-moça e pimentão verde",
          price: 42,
          menu: "Entrada",
          image: "image-1679521349769.jpg"
        },
        {
          title: "Brigadeiro Gourmet",
          description: "Delicioso doce de chocolate, feito com leite condensado, manteiga e cacau em pó, coberto com granulado.",
          price: 5,
          menu: "Sobremesa",
          image: "image-1679521362929.jpg"
        },
      ];

      for (const dish of initialDishes) {
        try {
          const menu = await menus.findOne({ name: dish.menu });
          if (menu) {
            dish.menu = menu._id;
          }
        } catch (error) {
          console.error(`Error while finding menu for dish ${dish.title}: ${error}`);
        }
      }

      dishes.insertMany(initialDishes, (error, docs) => {
        if (error) {
          console.error(error);
        } else {
          console.log(`${docs.length} dishes were successfully inserted into the database.`);
        }
      });
    }
  }
});

export default dishes;