import paymentMethods from "../models/paymentMethod.js";

class PaymentMethodsController {

  static listPaymentMethods = (req, res) => {
    paymentMethods.find((err, paymentMethods) => {
      if(err) {
        res.status(400).send({message: `${err.message} - Id do método de pagamento não encontrado. `})
      } else {
        res.status(200).json(paymentMethods)
      }
  })}

  static listPaymentMethodsById = (req, res) => {
    const id = req.params.id;
    paymentMethods.findById(id, (err, paymentMethods) => {
      if(err) {
        res.status(400).send({message: `${err.message} - Id do método de pagamento não encontrado. `})
      } else {
        res.status(200).send(paymentMethods)
      }

    });
  }

  static createPaymentMethods = (req, res) => {
    let paymentMethod = new paymentMethods(req.body);
    paymentMethod.save((err) => {
      if(err) {
        res.status(500).send({message: `${err.message} - Falha ao cadastrar método de pagamento.`})
      } else {
        res.status(201).send(paymentMethod.toJSON())
      }
    })
  }

  static updatePaymentMethods = (req, res) => {
    const id = req.params.id;
    paymentMethods.findByIdAndUpdate(id, {$set: req.body}, (err) => {
      if(!err){
        res.status(200).send({message: 'Método de pagamento atualizado com sucesso!'})
      } else {
        res.status(500).send({message: err.message})
      }
    })
  }

  static deletePaymentMethods = (req, res) => {
    const id = req.params.id;
    paymentMethods.findByIdAndDelete(id, (err) => {
      if(!err){
        res.status(200).send({message: `Método de pagamento ${id} removido com sucesso!`})
      } else {
        res.status(500).send({message: err.message})
      }
    })
  }
}

export default PaymentMethodsController;