import orderStatus from "../models/orderStatus.js";

class orderStatusController {

  static listOrdersStatus = (req, res) => {
    orderStatus.find((err, orderStatus) => {
      if(err) {
        res.status(400).send({message: `${err.message} - Id do status não encontrado. `})
      } else {
        res.status(200).json(orderStatus)
      }
  })}

  static listOrderStatusById = (req, res) => {
    const id = req.params.id;
    orderStatus.findById(id, (err, orderStatus) => {
      if(err) {
        res.status(400).send({message: `${err.message} - Id do status não encontrado. `})
      } else {
        res.status(200).send(orderStatus)
      }

    });

  }

  static createOrderStatus = (req, res) => {
    let status = new orderStatus(req.body);
    orderStatus.save((err) => {
      if(err) {
        res.status(500).send({message: `${err.message} - Falha ao cadastrar status.`})
      } else {
        res.status(201).send(status.toJSON())
      }
    })
  }

  static updateOrderStatus = (req, res) => {
    const id = req.params.id;
    orderStatus.findByIdAndUpdate(id, {$set: req.body}, (err) => {
      if(!err){
        res.status(200).send({message: 'Status atualizado com sucesso!'})
      } else {
        res.status(500).send({message: err.message})
      }
    })
  }

  static deleteOrderStatus = (req, res) => {
    const id = req.params.id;
    orderStatus.findByIdAndDelete(id, (err) => {
      if(!err){
        res.status(200).send({message: `Status ${id} removido com sucesso!`})
      } else {
        res.status(500).send({message: err.message})
      }
    })
  }

}

export default orderStatusController;