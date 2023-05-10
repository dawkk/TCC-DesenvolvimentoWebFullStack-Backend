import orders from "../models/order.js";
import users from "../models/user.js";
import orderStatus from "../models/orderStatus.js";
import orderItems from "../models/orderItems.js";


class OrderController {

  static createOrder = async (req, res) => {
    const userId = req.id;
    const addressReq = req.body.deliveryAddress;

    try {
      const user = await users.findById(userId);
      if (!user) {
        return res.status(404).send({ message: 'Usuário não encontrado.' });
      }

      const addressIndex = user.addresses.findIndex(addr => addr._id == addressReq);
      if (addressIndex === -1) {
        return res.status(404).send({ message: 'Endereço não encontrado.' });
      }

      const { totalAmount, paymentMethod } = req.body;

      const pendingStatus = await orderStatus.findOne({ status: 'Pendente' });
      if (!pendingStatus) {
        return res.status(500).send({ message: 'Falha ao criar pedido. Status pendente não encontrado.' });
      }
      console.log('this is backend cartItems', req.body.cartItems)
      const cartItems = req.body.cartItems;
      const cartItemIds = cartItems.map(item => item._id);
      const existingOrderItems = await orderItems.find({ _id: { $in: cartItemIds } });
      console.log('this is backend existingOrderItems', existingOrderItems)
      console.log('this is backend cartItemsIDS', cartItemIds)


      const order = new orders({
        userId,
        deliveryAddress: user.addresses[addressIndex],
        cartItems: cartItems,
        status: pendingStatus._id,
        totalAmount,
        paymentMethod,
      });

      // Save the order
      const savedOrder = await order.save();

      res.status(201).send(savedOrder);
    } catch (error) {
      res.status(500).send({ message: `${error.message} - Falha ao criar pedido.` });
    }
  };

  static listAllOrders = async (req, res) => {
    const orderFind = await orders.find()
      .populate('status')
      .sort({ 'dateOrdered': -1 });
    if (!orderFind) {
      res.status(500).json({ message: "Erro ao tentar listar ordem" })
    } else {
      res.status(200).send(orderFind);
    }
  };

  static listOrderById = async (req, res) => {
    const order = await orders.findById(req.params.id)
      .populate('userId')
      .populate('deliveryAddress')
      .populate('paymentMethod')
      .populate('cartItems')
      .populate('status')

    if (!order) {
      res.status(500).json({ message: "Erro ao tentar listar ordem" })
    } else {
      res.send(order);
    }
  };

  static updateOrder = async (req, res) => {
    const id = req.params.id;
    orders.findByIdAndUpdate(id, { $set: req.body }, (err) => {
      if (!err) {
        res.status(200).send({ message: 'Pedido foi atualizado com sucesso!' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
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

  /* USER SELF ROUTES */

  static listSelfOrders = async (req, res) => {
    const id = req.id;
    try {
      const orderFind = await orders.find({ userId: id })
        .sort({ 'dateOrdered': -1 })
        .populate({
          path: 'userId',
          select: '-password',
          select: '-roles',
          select: '-refreshToken',
          select: '-addresses'
        })
        .populate('deliveryAddress')
        .populate('paymentMethod')
        .populate('cartItems')
        .populate('status');
      if (!orderFind || orderFind.length === 0) {
        res.status(404).json({ message: "No orders found for this user" });
      } else {
        res.status(200).send(orderFind);
      }
    } catch (error) {
      res.status(500).json({ message: "Error while trying to list orders", error });
    }
  };

  static listSelfOrderById = async (req, res) => {
    const orderId = req.params.id;
    const userId = req.id;
    try {
      const order = await orders.findOne({ _id: orderId, userId: userId })
      .populate({
        path: 'userId',
        select: '-password',
        select: '-roles',
        select: '-refreshToken',
        select: '-addresses'
      })
      .populate('deliveryAddress')
      .populate('paymentMethod')
      .populate('cartItems')
      .populate('status');

      if (!order) {
        res.status(404).json({ message: "Order not found" });
      } else {
        res.status(200).send(order);
      }
    } catch (error) {
      res.status(500).json({ message: "Error while trying to retrieve order", error });
    }
  };



  /* ORDERS STATUS */


  static listOrdersStatus = (req, res) => {
    orderStatus.find((err, orderStatus) => {
      if (err) {
        res.status(500).send({ message: `${err.message} - Erro desconhecido. ` })
      } else {
        res.status(200).json(orderStatus)
      }
    })
  }

  static listOrderStatusById = (req, res) => {
    const id = req.params.id;
    orderStatus.findById(id, (err, orderStatus) => {
      if (err) {
        res.status(400).send({ message: `${err.message} - Id do status não encontrado. ` })
      } else if (!orderStatus) {
        res.status(404).send({ message: `Status não encontrado para o id: ${id}` })
      } else {
        res.status(200).send(orderStatus)
      }
    });
  }

  static createOrderStatus = (req, res) => {
    let status = new orderStatus(req.body);
    status.save((err) => {
      if (err) {
        res.status(500).send({ message: `${err.message} - Falha ao cadastrar status.` })
      } else {
        res.status(201).send(status.toJSON())
      }
    })
  }

  static updateOrderStatus = (req, res) => {
    const id = req.params.id;
    orderStatus.findByIdAndUpdate(id, { $set: req.body }, (err, orderStatus) => {
      if (!err && !orderStatus) {
        res.status(404).send({ message: `Status não encontrado para o id: ${id}` });
      } else if (!err) {
        res.status(200).send({ message: 'Status atualizado com sucesso!' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
  }

  static deleteOrderStatus = (req, res) => {
    const id = req.params.id;
    orderStatus.findByIdAndDelete(id, (err, orderStatus) => {
      if (!err && !orderStatus) {
        res.status(404).send({ message: `Status não encontrado para o id: ${id}` });
      } else if (!err) {
        res.status(200).send({ message: `Status ${id} removido com sucesso!` });
      } else {
        res.status(500).send({ message: err.message });
      }
    })
  }

}

export default OrderController;