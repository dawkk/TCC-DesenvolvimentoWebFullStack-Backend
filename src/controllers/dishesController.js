import dishes from "../models/dish.js";
import upload from "../config/uploadDishImg.js"
import mongoose from "mongoose";
import fs from 'fs';



class DishController {

  static listDishesFrontend = (req, res) => {
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

  static listAllDishes = (req, res) => {
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
      .populate('menu', 'name')
      .exec((err, dishes) => {
        if (err) {
          console.log('erro na listagem do prato ->', err)
          res.status(400).send({ message: `${err.message} - Id do prato não encontrado. ` })
        } else {
          res.status(200).send(dishes)
        }
      }
      );
  }

  static listDishesByMenuId = (req, res) => {
    const menuId = mongoose.Types.ObjectId(req.params.menuId);
    dishes.find({ menu: menuId })
      .populate('menu', 'name')
      .exec((err, dishes) => {
        if (err) {
          console.log('erro na listagem de pratos ->',err);
          res.status(400).send({ message: `${err.message} - Não foi possível listar os pratos. ` });
        } else {
          res.status(200).send(dishes);
        }
      });
  }

  static createDish = (req, res) => {
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
        console.log('erro no update do prato ->', err)
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
        console.log('erro no delete do prato ->', err)
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

  /* IMAGE----------------------------------------------------- */

  /* static uploadDishImage = [
    upload.single("image"),
    (req, res, next) => {
      const id = req.params.id;
      if (!req.file) {
        res.status(400).send({ message: "No image file provided" });
        return;
      }
      console.log('this is req received on backend', req)
      console.log('this is dish ID received on backend', id)
      dishes.findByIdAndUpdate(
        id,
        { image: req.file.filename },
        (err, dish) => {
          if (err) {
            console.log('error message:', err)
            res.status(500).send({ message: err.message });
          } else if (!dish) {
            console.log('error message:', dish)
            console.log('error message:', err)
            res.status(404).send({ message: `Dish ${id} not found` });
          } else {
            res.status(200).send({ success: 'Image uploaded successfully!', image: req.file.filename });
          }
        }
      );
    },
  ];
 */

  static uploadDishImage = [
    (req, res, next) => {
      const id = req.params.id;
      // Get the current dish information
      dishes.findById(id, (err, dish) => {
        if (err) {
          res.status(500).send({ message: err.message });
          return;
        } else if (!dish) {
          res.status(404).send({ message: `Dish ${id} not found` });
          return;
        }
        // Delete the current image if exists
        if (dish.image) {
          fs.unlink(`./src/temporary/uploads/${dish.image}`, (err) => {
            if (err) {
              console.log("Error deleting current image:", err);
            }
          });
        }
        // Upload the new image
        upload.single("image")(req, res, (err) => {
          if (err) {
            res.status(400).send({ message: "No image file provided" });
            return;
          }
          // Update the dish with the new image filename
          dishes.findByIdAndUpdate(
            id,
            { image: req.file.filename },
            (err, dish) => {
              if (err) {
                res.status(500).send({ message: err.message });
              } else {
                res.status(200).send({ success: "Image uploaded successfully!", image: req.file.filename });
              }
            }
          );
        });
      });
    },
  ];

  static getDishImage = (req, res) => {
    const id = req.params.id;
    dishes.findById(id, "image", (err, dish) => {
      if (err) {
        res.status(500).send({ message: err.message });
      } else if (!dish) {
        res.status(404).send({ message: `Dish ${id} not found` });
      } else if (!dish.image || !fs.existsSync(`./src/temporary/uploads/dishes/${dish.image}`)) {
        res.status(404).send({ message: `Image for dish ${id} not found` });
      } else {
        res.sendFile(dish.image, { root: "./src/temporary/uploads/dishes" });
      }
    });
  }

}

export default DishController;