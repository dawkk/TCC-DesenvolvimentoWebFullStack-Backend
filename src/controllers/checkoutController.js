import checkouts from "../models/checkout.js";
import users from "../models/user.js";


class CheckoutController {

  static createCheckout = async (req, res) => {
    try {
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
      const { cartItems, totalPrice, paymentMethod } = req.body;

      const checkout = new checkouts({
        userId,
        deliveryAddress: user.addresses[addressIndex],
        cartItems,
        totalPrice,
        paymentMethod
      });
      const savedCheckout = await checkout.save();
      res.status(201).send(savedCheckout);
    } catch (error) {
      res.status(500).send({ message: `${error.message} - Falha ao criar checkout.` });
    }
  }

  static listAllCheckouts = async (req, res) => {
    const checkoutFind = await checkouts.find()
    .sort({ 'expiresAt': -1 });
    if (!checkoutFind) {
      res.status(500).json({ message: "Erro ao tentar listar checkout" })
    } else {
      res.status(200).send(checkoutFind);
    }
  };

  static listCheckoutById = async (req, res) => {
    const checkout = await checkouts.findById(req.params.id)
    .populate('userId')
    .populate('deliveryAddress')
    .populate('paymentMethod')
    
    if (!checkout) {
      res.status(500).json({ message: "Erro ao tentar listar checkout" })
    } else {
      res.send(checkout);
    }
  };
  
  static updateCheckoutById = async (req, res) => {
    const id = req.params.id;
    checkouts.findByIdAndUpdate(id, { $set: req.body }, (err) => {
      if (!err) {
        res.status(200).send({ message: 'Checkout foi atualizado com sucesso!' })
      } else {
        res.status(500).send({ message: err.message })
      }
    })
  }

  static deleteCheckoutById = (req, res) => {
    const id = req.params.id;
    checkouts.findByIdAndDelete(id, (err) => {
      if (!err) {
        res.status(200).send({ message: `Checkout ${id} removido com sucesso!` })
      } else {
        res.status(500).send({ message: err.message })
      }
    })
  }

  /* USER SELF ROUTES */

  static listSelfCheckouts = async (req, res) => {
    const id = req.id;
    try {
      const checkoutFind = await checkouts.find({ userId: id})
        .sort({ 'expiresAt': -1 })
      if (!checkoutFind || checkoutFind.length === 0) {
        res.status(404).json({ message: "Checkouts não encontrados para este usuario" });
      } else {
        res.status(200).send(checkoutFind);
      }
    } catch (error) {
      res.status(500).json({ message: "Erro ao tentar retornar checkouts", error });
    }
  };

  static listSelfCheckoutById = async (req, res) => {
    const checkoutId = req.params.id;
    const userId = req.id;
    try {
      const checkout = await checkouts.findOne({ _id: checkoutId, userId: userId })

      if (!checkout) {
        res.status(404).json({ message: "Checkout não encontrado" });
      } else {
        res.status(200).send(checkout);
      }
    } catch (error) {
      res.status(500).json({ message: "Erro ao tentar retornar checkout", error });
    }
  };

  static updateSelfCheckout = async (req, res) => {
    try {
      const checkoutId = req.params.id;
      const userId = req.id;
      const updatedData = req.body;
      const checkout = await checkouts.findById(checkoutId);
      
      if (!checkout) {
        return res.status(404).send({ message: 'Checkout não encontrado.' });
      }
      if (checkout.userId.toString() !== userId) {
        return res.status(401).send({ message: 'Este Usuário não possui permissão para modificar este checkout.' });
      }
      const updatedCheckout = await checkouts.findByIdAndUpdate(checkoutId, { $set: updatedData }, { new: true });
      res.status(200).send({ message: 'Checkout foi atualizado com sucesso!', data: updatedCheckout });
    } catch (error) {
      res.status(500).send({ message: `${error.message} - Falha ao atualizar checkout.` });
    }
  }

  static deleteSelfCheckout = async (req, res) => {
    const id = req.params.id;
    const userId = req.id;
  
    try {
      const checkout = await checkouts.findById(id);
      if (!checkout) {
        return res.status(404).send({ message: 'Checkout não encontrado.' });
      }
      if (checkout.userId.toString() !== userId) {
        return res.status(403).send({ message: 'Este Usuário não possui permissão para excluir este checkout.' });
      }
      await checkouts.findByIdAndDelete(id);
      res.status(200).send({ message: `Checkout ${id} removido com sucesso!` });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  }
  

}

export default CheckoutController;