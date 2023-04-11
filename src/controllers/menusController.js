import menus from "../models/menu.js";
import upload from "../config/uploadImg.js"
import fs from 'fs';

class MenuController {

  static listMenus = (req, res) => {
    menus.find((err, menus) => {
      if(err) {
        res.status(400).send({message: `${err.message} - Id do prato não encontrado. `})
      } else {
        res.status(200).json(menus)
      }
  })}

  static listMenuById = (req, res) => {
    const id = req.params.id;
    menus.findById(id, (err, menus) => {
      if(err) {
        res.status(400).send({message: `${err.message} - Id do prato não encontrado. `})
      } else {
        res.status(200).send(menus)
      }

    });

  }

  static createMenu = (req, res) => {
    /* para lembrar menus aqui se refere ao schema/coleção que criamos no mongoose em models como referencia */
    let menu = new menus(req.body);
    menu.save((err) => {
      if(err) {
        res.status(500).send({message: `${err.message} - Falha ao cadastrar prato.`})
      } else {
        res.status(201).send(menu.toJSON())
      }
    })
  }

  static updateMenu = (req, res) => {
    const id = req.params.id;
    menus.findByIdAndUpdate(id, {$set: req.body}, (err) => {
      if(!err){
        res.status(200).send({message: 'Prato atualizado com sucesso!'})
      } else {
        res.status(500).send({message: err.message})
      }
    })
  }

  static deleteMenu = (req, res) => {
    const id = req.params.id;
    menus.findByIdAndDelete(id, (err) => {
      if(!err){
        res.status(200).send({message: `Prato ${id} removido com sucesso!`})
      } else {
        res.status(500).send({message: err.message})
      }
    })
  }

  /* IMAGE----------------------------------------------------- */

  static uploadMenuImage = [
    upload.single("image"),
    (req, res, next) => {
      const id = req.params.id;
      if (!req.file) {
        res.status(400).send({ message: "No image file provided" });
        return;
      }
      menus.findByIdAndUpdate(
        id,
        { image: req.file.filename },
        (err, menu) => {
          if (err) {
            console.log('error message:', err)
            res.status(500).send({ message: err.message });
          } else if (!menu) {
            console.log('error message:', menu)
            console.log('error message:', err)
            res.status(404).send({ message: `Menu ${id} not found` });
          } else {
            res.status(200).send({ message: "Image uploaded successfully" });
          }
        }
      );
    },
  ];

  static getMenuImage = (req, res) => {
    const id = req.params.id;
    menus.findById(id, "image", (err, menu) => {
      if (err) {
        res.status(500).send({ message: err.message });
      } else if (!menu) {
        res.status(404).send({ message: `Menu ${id} not found` });
      } else if (!menu.image || !fs.existsSync(`./src/temporary/uploads/${menu.image}`)) {
        res.status(404).send({ message: `Image for menu ${id} not found` });
      } else {
        res.sendFile(menu.image, { root: "./src/temporary/uploads/" });
      }
    });
  }

}

export default MenuController;