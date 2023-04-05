import express from "express";
import verifyJWT from "../middlewares/verifyJWT.js";
import OrderController from "../controllers/orderController.js";

const router = express.Router();

router.use(verifyJWT)

router.route("/orders")
  .get(verifyJWT, OrderController.listAllOrders)
  .post(verifyJWT, OrderController.createOrder)

router.route("/orders/:id")
  .get(verifyJWT, OrderController.listOrderById)
  .put(verifyJWT, OrderController.updateOrder)
  .delete(verifyJWT, OrderController.deleteOrder)

/* router
  .get("/orders/:id", verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), OrderController.listOrdersByUserId)
  .get("/orders/totalsales", OrderController.listOrdersTotalSales) */


export default router;