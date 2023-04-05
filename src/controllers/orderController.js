import orders from "../models/order.js"
import users from "../models/user.js";


class OrderController {


  static createOrder = async (req, res) => {
    const userId = req.id;
    const addressReq = req.body.deliveryAddress;
    const user = await users.findById(userId);
    if (!user) {
      return res.status(404).send({ message: 'Usuário não encontrado.' });
    }
    const addressIndex = user.addresses.findIndex(addr => addr._id == addressReq);
    if (addressIndex === -1) {
      return res.status(404).send({ message: 'Endereço não encontrado.' });
    }
    const { cartItems, status, totalPrice, dateOrdered } = req.body;
    const newOrder = new orders({
      userId,
      deliveryAddress: user.addresses[addressIndex],
      cartItems,
      status,
      totalPrice,
      dateOrdered,
    });
    newOrder.save((err) => {
      if (err)
        return res
          .status(500)
          .send({ message: `${err.message} - Falha ao criar pedido.` });
      else {
        return res.status(201).send(newOrder);
      }
    });
  }

  static listAllOrders = async (req, res) => {
    const orderFind = await orders.find().populate('orderedItems.dishId').sort({ 'dateOrdered': -1 });
    if (!orderFind) {
      res.status(500).json({ message: "Erro ao tentar listar ordem" })
    } else {
      res.status(200).send(orderFind);
    }
  };

  static listOrderById = async (req, res) => {
    const order = await orders.findById(req.params.id).populate('orderedItems.dishId')

    if (!order) {
      res.status(500).json({ message: "Erro ao tentar listar ordem" })
    } else {
      res.send(order);
    }
  };




  /* sidenote if we add all products at once inside the array it will add correctly, otherwise it will substitute currently dish for new added dish */
  static updateOrder = async (req, res) => {
    const id = req.params.id;
    orders.findByIdAndUpdate(id, { $set: req.body }, (err) => {
      if (!err) {
        res.status(200).send({ message: 'Pedido foi atualizado com sucesso!' })
      } else {
        res.status(500).send({ message: err.message })
      }
    })
  }

  static deleteOrder = (req, res) => {
    const id = req.params.id;
    orders.findByIdAndDelete(id, (err) => {
      if (!err) {
        res.status(200).send({ message: `Pedido ${id} removido com sucesso!` })
      } else {
        res.status(500).send({ message: err.message })
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