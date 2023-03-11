import express from "express";
import verifyJWT from "../middlewares/verifyJWT.js";
import verifyRoles from "../middlewares/verifyRoles.js";
import ROLES_LIST from "../config/roles_list.js";
import OrderController from "../controllers/orderController.js";

const router = express.Router();

router.use(verifyJWT)

router.route("/orders")
  .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), OrderController.listAllOrders)
  .post(OrderController.createOrder)

router.route("/orders/:id")
  .get(verifyRoles(ROLES_LIST.User), OrderController.listOrderById)
  .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), OrderController.updateOrder)
  .delete(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), OrderController.deleteOrder)

/* router
  .get("/orders/:id", verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), OrderController.listOrdersByUserId)
  .get("/orders/totalsales", OrderController.listOrdersTotalSales) */


  




export default router;