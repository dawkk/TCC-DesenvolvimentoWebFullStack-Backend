import express from "express";
import verifyJWT from "../middlewares/verifyJWT.js";
import verifyRoles from "../middlewares/verifyRoles.js";
import ROLES_LIST from "../config/roles_list.js";
import OrderController from "../controllers/orderController.js";

const router = express.Router();

router.use(verifyJWT)

router
  .get("/orders/status/:id", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), OrderController.listOrderStatusById)
  .put("/orders/status/:id", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), OrderController.updateOrderStatus)
  .delete("/orders/status/:id", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), OrderController.deleteOrderStatus)
  .post("/orders/status", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), OrderController.createOrderStatus)
  .get("/orders/status", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), OrderController.listOrdersStatus)
  .get("/orders/me/:id", verifyJWT, OrderController.listSelfOrderById)
  .get("/orders/me", verifyJWT, OrderController.listSelfOrders)
  .get("/orders/:id", verifyJWT, OrderController.listOrderById)
  .put("/orders/:id", verifyJWT, OrderController.updateOrder)
  .delete("/orders/:id", verifyJWT, OrderController.deleteOrder)
  .get("/orders", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), OrderController.listAllOrders)
  .post("/orders", verifyJWT, OrderController.createOrder)

/* router
  .get("/orders/:id", verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), OrderController.listOrdersByUserId)
  .get("/orders/totalsales", OrderController.listOrdersTotalSales) */





export default router;