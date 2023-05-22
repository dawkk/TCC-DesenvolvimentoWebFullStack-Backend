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

      const cartItems = req.body.cartItems;
      const cartItemIds = cartItems.map(item => item._id);
      const existingOrderItems = await orderItems.find({ _id: { $in: cartItemIds } });

      const order = new orders({
        userId,
        deliveryAddress: user.addresses[addressIndex],
        cartItems: cartItems,
        status: pendingStatus._id,
        totalAmount,
        paymentMethod,
      });
      
      const savedOrder = await order.save();

      res.status(201).send(savedOrder);
    } catch (error) {
      res.status(500).send({ message: `${error.message} - Falha ao criar pedido.` });
    }
  };

  static listOrdersByOrderStatus = async (req, res) => {
    const { orderStatusId } = req.query;
  
    try {
      const orderFind = await orders
        .find({ status: orderStatusId })
        .populate('userId')
        .populate('deliveryAddress')
        .populate('paymentMethod')
        .populate({
          path: 'cartItems',
          populate: {
            path: 'dishId',
            model: 'dishes',
            select: 'title price id',
          },
        })
        .populate('status')
        .sort({ dateOrdered: -1 });
  
      if (!orderFind || orderFind.length === 0) {
        return res.status(404).json({ message: "No orders found for the specified status" });
      }
  
      res.status(200).send(orderFind);
    } catch (error) {
      console.error('Error listing orders:', error);
      res.status(500).json({ message: "Error while listing orders" });
    }
  };
  


  static listAllOrders= async (req, res) => {
    const orderFind = await orders.find()
      .populate('userId')
      .populate('deliveryAddress')
      .populate('paymentMethod')
      .populate({
        path: 'cartItems',
        populate: {
          path: 'dishId',
          model: 'dishes',
          select: 'title price id'
        }
      })
      .populate('status')
      .sort({ 'dateOrdered': -1 });
    if (!orderFind) {
      res.status(500).json({ message: "Erro ao tentar listar ordem" })
    } else {
      res.status(200).send(orderFind);
    }
  };

  static listAllOrdersNewToOld = async (req, res) => {
    const orderFind = await orders.find()
      .populate('userId')
      .populate('deliveryAddress')
      .populate('paymentMethod')
      .populate('cartItems')
      .populate('status')
      .sort({ 'dateOrdered': -1 });
    if (!orderFind) {
      res.status(500).json({ message: "Erro ao tentar listar ordem" })
    } else {
      res.status(200).send(orderFind);
    }
  };

  static listAllOrdersOldToNew = async (req, res) => {
    const orderFind = await orders.find()
      .populate('userId')
      .populate('deliveryAddress')
      .populate('paymentMethod')
      .populate('cartItems')
      .populate('status')
      .sort({ 'dateOrdered': 1 });
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
      .populate({
        path: 'cartItems',
        populate: {
          path: 'dishId',
          model: 'dishes',
          select: 'title price id'
        }
      })
      .populate('status')

    if (!order) {
      res.status(500).json({ message: "Erro ao tentar listar ordem" })
    } else {
      res.send(order);
    }
  };

  static listOrderByUserId = async (req, res) => {
    try {
      const orderList = await orders
        .find({ userId: req.params.id })
        .populate('userId')
        .populate('deliveryAddress')
        .populate('paymentMethod')
        .populate({
          path: 'cartItems',
          populate: {
            path: 'dishId',
            model: 'dishes',
            select: 'title price id'
          }
        })
        .populate('status');
  
      if (!orderList) {
        return res.status(404).json({ message: 'Pedidos não encontrados para usuário.' });
      }
  
      res.send(orderList);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao retornar pedidos.' });
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
  /* QUERY ROUTES */

  static listCompletedOrdersByQueryDate = async (req, res) => {
    try {
      const orderStatusCompleted = await orderStatus.findOne({ status: "Completo" });
      if (!orderStatusCompleted) {
        return res.status(404).json({ message: "Order status 'Completo' not found" });
      }
  
      const ordersFound = await orders.find({ status: orderStatusCompleted._id })
        .select("dateOrdered totalAmount")
        .sort({ 'dateOrdered': -1 });
  
      const startDate = new Date(req.body.query.startDate);
      const endDate = new Date(req.body.query.endDate);
  
      const filteredOrders = ordersFound.filter(order => {
        const orderDate = new Date(order.dateOrdered);
        return orderDate >= startDate && orderDate <= endDate;
      });
  
      const salesByDate = filteredOrders.reduce((map, order) => {
        const orderDate = new Date(order.dateOrdered).toISOString().split('T')[0]; // Extract the date part
        if (map.has(orderDate)) {
          map.get(orderDate).totalSales += order.totalAmount;
          map.get(orderDate).orderCount += 1;
        } else {
          map.set(orderDate, {
            totalSales: order.totalAmount,
            orderCount: 1
          });
        }
        return map;
      }, new Map());
  
      const salesData = Array.from(salesByDate.entries()).map(([date, { totalSales, orderCount }]) => ({
        date,
        totalSales,
        orderCount
      }));
  
      const orderCount = filteredOrders.length;
      orderCount;
      const totalSales = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  
      res.status(200).json({ salesData, totalSales, orderCount });
    } catch (error) {
      console.error('Error listing orders:', error);
      res.status(500).json({ message: "Error listing orders" });
    }
  };

  

  /* static listCompletedOrdersByQueryDate = async (req, res) => {
    try {
      const orderStatusCompleted = await orderStatus.findOne({ status: "Completo" });
      if (!orderStatusCompleted) {
        return res.status(404).json({ message: "Order status 'Completo' not found" });
      }

      console.log('orderStatusCompleted', orderStatusCompleted)

      const ordersFound = await orders.find({ status: orderStatusCompleted._id })
        .select("dateOrdered totalAmount")
        .sort({ 'dateOrdered': -1 });
    
        console.log('ordersFound', ordersFound)
        const startDate = new Date(req.body.query.startDate);
        const endDate = new Date(req.body.query.endDate);
        
        const filteredOrders = ordersFound.filter(order => {
          const orderDate = new Date(order.dateOrdered);
          return orderDate >= startDate && orderDate <= endDate;
        });
  
        const orderCount = filteredOrders.reduce((count, order) => {
          const orderDate = new Date(order.dateOrdered);
          if (orderDate >= startDate && orderDate <= endDate) {
            return count + 1;
          }
          return count;
        }, 0);

      console.log('orderCount', orderCount)
      const totalSales = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    
      res.status(200).json({ dates: filteredOrders.map(order => order.dateOrdered), totalSales, orderCount });
    } catch (error) {
      console.error('Error listing orders:', error);
      res.status(500).json({ message: "Error listing orders" });
    }
  }; */

  
  
  

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
        .populate({
          path: 'cartItems',
          populate: {
            path: 'dishId',
            model: 'dishes',
            select: 'title price id'
          }
        })
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