import menus from "../models/menu.js";

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

}

export default MenuController;