import PaymentMethodsController from "../controllers/paymentMethodController.js";
import express from "express";
import verifyJWT from "../middlewares/verifyJWT.js";
import verifyRoles from "../middlewares/verifyRoles.js";
import ROLES_LIST from "../config/roles_list.js";

const router = express.Router();

router
  .put("/paymentMethods/:id", verifyJWT, verifyRoles(ROLES_LIST.Admin), PaymentMethodsController.updatePaymentMethods)
  .delete("/paymentMethods/:id", verifyJWT, verifyRoles(ROLES_LIST.Admin), PaymentMethodsController.deletePaymentMethods)
  .get("/paymentMethods/:id",verifyJWT, PaymentMethodsController.listPaymentMethodsById)
  .post("/paymentMethods", verifyJWT, verifyRoles(ROLES_LIST.Admin), PaymentMethodsController.createPaymentMethods)
  .get("/paymentMethods",verifyJWT, PaymentMethodsController.listPaymentMethods)

export default router;