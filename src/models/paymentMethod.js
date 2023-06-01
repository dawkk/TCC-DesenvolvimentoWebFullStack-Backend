import mongoose from "mongoose";

const paymentMethodSchema = new mongoose.Schema(
  {
    name: {type: String, required: true, unique:true},
  },
  { timestamps: true }
);

const paymentMethods = mongoose.model('paymentMethods', paymentMethodSchema)


/* 

const updatePaymentMethods = async () => {
  try {
    const count = await paymentMethods.countDocuments({});
    if (count === 0) {
      const initialPaymentMethods = [
        {
          name: "Dinheiro"
        },
        {
          name: "PIX à vista"
        },
        {
          name: "Cartão de Crédito"
        },
        {
          name: "Cartão de Débito"
        },
        {
          name: "Vale Alimentação"
        },
        {
          name: "Vale Refeição"
        },
      ];
      const docs = await paymentMethods.insertMany(initialPaymentMethods);
      console.log(`${docs.length} Payment methods were successfully inserted into the database.`);
    }
  } catch (error) {
    console.error(error);
  }
};

await updatePaymentMethods();
console.log(await updatePaymentMethods()); */


export default paymentMethods;