import dishes from "../models/dish.js";
import { storage } from "../config/uploadImg.js";
import { upload } from "../config/uploadImg.js";


class DishController {


  static listDishes = (req, res) => {
    dishes.find()
      .populate('menu')
      .exec((err, dishes) => {
        if (err) {
          res.status(400).send({ message: `${err.message} - Id do prato não encontrado. ` })
        } else {
          res.status(200).json(dishes)
        }
      }
      )
  }

  static listDishById = (req, res) => {
    const id = req.params.id;
    dishes.findById(id)
      /* Lembrar de deixar o nome do esquema em singular, por ex menus é o esquema porem abaixo usamos menu */
      .populate('menu', 'name')
      .exec((err, dishes) => {
        if (err) {
          res.status(400).send({ message: `${err.message} - Id do prato não encontrado. ` })
        } else {
          res.status(200).send(dishes)
        }
      }
      );
  }

  static createDish = (req, res) => {
    /* para lembrar dishes aqui se refere ao schema/coleção que criamos no mongoose em models como referencia */
    let dish = new dishes(req.body);
    dish.save((err) => {
      if (err) {
        res.status(500).send({ message: `${err.message} - Falha ao cadastrar prato.` })
      } else {
        res.status(201).send(dish.toJSON())
      }
    })
  }

  static updateDish = (req, res) => {
    const id = req.params.id;
    dishes.findByIdAndUpdate(id, { $set: req.body }, (err) => {
      if (!err) {
        res.status(200).send({ message: 'Prato atualizado com sucesso!' })
      } else {
        res.status(500).send({ message: err.message })
      }
    })
  }

  static deleteDish = (req, res) => {
    const id = req.params.id;
    dishes.findByIdAndDelete(id, (err) => {
      if (!err) {
        res.status(200).send({ message: `Prato ${id} removido com sucesso!` })
      } else {
        res.status(500).send({ message: err.message })
      }
    })
  }

  static listDishByType = (req, res) => {
    const type = req.query.type;

    dishes.find({ 'type': type }, {}, (err, dishes) => {
      if (!err) {
        res.status(200).send(dishes)
      } else {
        res.status(500).send({ message: err.message })
      }
    })
  }

  static uploadDishImage = [
    upload.single("image"),
    (req, res, next) => {
      const id = req.params.id;
      if (!req.file) {
        res.status(400).send({ message: "No image file provided" });
        return;
      }
      dishes.findByIdAndUpdate(
        id,
        { image: req.file.filename },
        (err, dish) => {
          if (err) {
            res.status(500).send({ message: err.message });
          } else if (!dish) {
            res.status(404).send({ message: `Dish ${id} not found` });
          } else {
            res.status(200).send({ message: "Image uploaded successfully" });
          }
        }
      );
    },
  ];

  static getDishImage = (req, res) => {
    const id = req.params.id;
    dishes.findById(id, "image", (err, dish) => {
      if (err) {
        res.status(500).send({ message: err.message });
      } else if (!dish) {
        res.status(404).send({ message: `Dish ${id} not found` });
      } else {
        res.sendFile(dish.image, { root: "./uploads/" });
      }
    });
  };

}

export default DishController;