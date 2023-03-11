import orders from "../models/order.js"

class OrderController {

  static listAllOrders = async (req, res) => {
    const orderFind = await orders.find().populate('orderedItems.dishId').sort({'dateOrdered': -1});
        if(!orderFind) {
          res.status(500).json({message: "Erro ao tentar listar ordem"})
        } else {
          res.status(200).send(orderFind);
        }
  };

  static listOrderById = async (req, res) => {
    const order = await orders.findById(req.params.id).populate('orderedItems.dishId')

     if(!order) {
        res.status(500).json({message: "Erro ao tentar listar ordem"})
    } else {
    res.send(order);
    }
  };

  static createOrder = async (req, res) => {
    const newOrder = new orders(req.body);
    newOrder.save((err) => {
      if(err) return res.status(500).send({message: `${err.message} - Falha ao criar pedido.`});
      else {return res.status(201).send(newOrder.toJSON())}
    })

  }


  /* sidenote if we add all products at once inside the array it will add correctly, otherwise it will substitute currently dish for new added dish */
  static updateOrder = async (req, res) => {
    const id = req.params.id;
    orders.findByIdAndUpdate(id, {$set: req.body}, (err) => {
      if(!err){
        res.status(200).send({message: 'Pedido foi atualizado com sucesso!'})
      } else {
        res.status(500).send({message: err.message})
      }
    })
  }

  static deleteOrder = (req, res) => {
    const id = req.params.id;
    orders.findByIdAndDelete(id, (err) => {
      if(!err){
        res.status(200).send({message: `Pedido ${id} removido com sucesso!`})
      } else {
        res.status(500).send({message: err.message})
      }
    })
  }


  /* static listOrdersTotalSales =  async (req, res) => {
    const totalSales = await orders.aggregate([
      {$group: {_id:null, totalsales: { $sum: '$totalPrice'}}}
    ])

      if(!totalSales){
        return res.status(400).send({message: `Erro: relatório de vendas não criado!`})
      } else {
        return res.status(200).send({totalsales: totalSales.pop().totalsales})
      }
  } */

}

export default OrderController;