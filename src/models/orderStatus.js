import mongoose from "mongoose";

const orderStatusesSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    unique: true
  }
});

const orderStatus = mongoose.model('orderStatus', orderStatusesSchema);
/* 
orderStatus.countDocuments({}, (error, count) => {
  if (error) {
    console.error(error);
  } else {
    if (count === 0) {
      const initialOrderStatus = [
        {
          status: "Pendente",
        },
        {
          status: "Iniciando Preparo do Pedido",
        },
        {
          status: "Pedido Pronto",
        },
        {
          status: "Delivery a caminho",
        },
        {
          status: "Completo",
        },
        {
          status: "Cancelado",
        },
      ];
      orderStatus.insertMany(initialOrderStatus, (error, docs) => {
        if (error) {
          console.error(error);
        } else {
          console.log(`${docs.length} Status de pedidos foram adicionados ao banco de dados com sucesso.`);
        }
      });
    }
  }
}); */

export default orderStatus;

