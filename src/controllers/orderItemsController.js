import users from "../models/user.js";
import orderItems from "../models/orderItems.js";


class OrderItemsController {

  static createOrderItem = async (req, res) => {
    const { userId, orderId, dishId, quantity } = req.body;
    const orderItem = new orderItems({
      userId,
      orderId,
      dishId,
      quantity,
    });
    try {
      const savedOrderItem = await orderItem.save();
      res.status(201).json(savedOrderItem);
    } catch (error) {
      res.status(500).send({ message: `${error.message} - Falha ao criar item de pedido.` });
    }
  };

  static listOrderItemById = async (req, res) => {
    const orderItemId = req.params.id
    try {
      const orderItem = await orderItems.findById(orderItemId);
      if (!orderItem) {
        return res.status(404).send({ message: 'Item de pedido não encontrado.' });
      }
      res.status(200).json(orderItem);
    } catch (error) {
      res.status(500).send({ message: `${error.message} - Falha ao buscar item de pedido.` });
    }
  };
  
  static listOrderItemsByOrderId = async (req, res) => {
    const orderId = req.params.id
    try {
      const orderItemsList = await orderItems.find({ orderId: orderId });
      res.status(200).json(orderItemsList);
    } catch (error) {
      res.status(500).send({ message: `${error.message} - Falha ao buscar itens de pedido.` });
    }
  };
  
  static listAllOrderItems = async (req, res) => {
    try {
      const orderItemsList = await orderItems.find();
      res.status(200).json(orderItemsList);
    } catch (error) {
      res.status(500).send({ message: `${error.message} - Falha ao buscar itens de pedido.` });
    }
  };
  
  static updateOrderItem = async (req, res) => {
    const orderItemId = req.params.id
    const { userId, orderId, dishId, quantity } = req.body;
    try {
      const orderItem = await orderItems.findById(orderItemId);
      if (!orderItem) {
        return res.status(404).send({ message: 'Item de pedido não encontrado.' });
      }
      orderItem.userId = userId;
      orderItem.orderId = orderId;
      orderItem.dishId = dishId;
      orderItem.quantity = quantity;
      const updatedOrderItem = await orderItem.save();
      res.status(200).json(updatedOrderItem);
    } catch (error) {
      res.status(500).send({ message: `${error.message} - Falha ao atualizar item de pedido.` });
    }
  };
  
  static deleteOrderItem = async (req, res) => {
    const orderItemId = req.params.id;
    try {
      const orderItem = await orderItems.findById(orderItemId);
      if (!orderItem) {
        return res.status(404).send({ message: 'Item de pedido não encontrado.' });
      }
      await orderItem.remove();
      res.status(200).send({ message: 'Item de pedido excluído com sucesso.' });
    } catch (error) {
      res.status(500).send({ message: `${error.message} - Falha ao excluir item de pedido.` });
    }
  };

  /* USER SELF ROUTES */

  static createSelfOrderItem = async (req, res) => {
    const userId = req.id;
    const { orderId, dishId, quantity } = req.body;
    try {
      const user = await users.findById(userId);
      if (!user) {
        return res.status(404).send({ message: 'Usuário não encontrado.' });
      }
      const orderItem = new orderItems({
        userId,
        orderId,
        dishId,
        quantity,
      });
      const savedOrderItem = await orderItem.save();
      res.status(201).json(savedOrderItem);
    } catch (error) {
      res.status(500).send({ message: `${error.message} - Falha ao criar item de pedido.` });
    }
  };
  
  static listSelfAllOrderItemsByOrderId = async (req, res) => {
    const orderId = req.params.orderId;
    const userId = req.id;
    try {
      const orderItemsList = await orderItems.find({ orderId: orderId, userId: userId });
      res.status(200).json(orderItemsList);
    } catch (error) {
      res.status(500).send({ message: `${error.message} - Falha ao buscar itens de pedido.` });
    }
  };
  
  static listSelfAllOrderItems = async (req, res) => {
    const id = req.id;
    try {
      const orderItemsList = await orderItems.find({ userId: id });
      res.status(200).json(orderItemsList);
    } catch (error) {
      res.status(500).send({ message: `${error.message} - Falha ao buscar itens de pedido.` });
    }
  };
  
  static updateSelfOrderItem = async (req, res) => {
    const orderItemId = req.params.id;
    const { orderId, dishId, quantity } = req.body;
    const userId = req.id;
    try {
      const orderItem = await orderItems.findById(orderItemId);
      if (!orderItem) {
        return res.status(404).send({ message: 'Item de pedido não encontrado.' });
      }
      if (orderItem.userId.toString() !== userId) {
        return res.status(403).send({ message: 'Você não tem permissão para atualizar este item de pedido.' });
      }
  
      const updatedOrderItem = await orderItems.findByIdAndUpdate(
        orderItemId,
        { $set: { orderId, dishId, quantity } },
        { new: true }
      );
      res.status(200).json(updatedOrderItem);
    } catch (error) {
      res.status(500).send({ message: `${error.message} - Falha ao atualizar item de pedido.` });
    }
  };
  
  static deleteSelfOrderItem = async (req, res) => {
    const orderItemId = req.params.id;
    const userId = req.id;
    try {
      const orderItem = await orderItems.findOne({ _id: orderItemId, userId });
      if (!orderItem) {
        return res.status(404).send({ message: 'Item de pedido não encontrado.' });
      }
      await orderItem.remove();
      res.status(200).send({ message: 'Item de pedido excluído com sucesso.' });
    } catch (error) {
      res.status(500).send({ message: `${error.message} - Falha ao excluir item de pedido.` });
    }
  };

}

export default OrderItemsController;