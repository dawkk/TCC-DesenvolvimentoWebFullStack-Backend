import express from "express";
import verifyJWT from "../middlewares/verifyJWT.js";
import verifyRoles from "../middlewares/verifyRoles.js";
import ROLES_LIST from "../config/roles_list.js";
import OrderController from "../controllers/orderController.js";

const router = express.Router();

router
  .post("/orders/status/completed/query", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), OrderController.listCompletedOrdersByQueryDate)
  .get("/orders/status/query", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), OrderController.listOrdersByOrderStatus)
  .get("/orders/status/:id", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), OrderController.listOrderStatusById)
  .put("/orders/status/:id", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), OrderController.updateOrderStatus)
  .delete("/orders/status/:id", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), OrderController.deleteOrderStatus)
  .get("/orders/user/:id", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), OrderController.listOrderByUserId)
  .post("/orders/status", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), OrderController.createOrderStatus)
  .get("/orders/status", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), OrderController.listOrdersStatus)
  .get("/orders/me/:id", verifyJWT, OrderController.listSelfOrderById)
  .get("/orders/me", verifyJWT, OrderController.listSelfOrders)
  .get("/orders/:id", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), OrderController.listOrderById)
  .put("/orders/:id", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), OrderController.updateOrder)
  .delete("/orders/:id", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), OrderController.deleteOrder)
  .get("/orders", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), OrderController.listAllOrders)
  .post("/orders", verifyJWT, OrderController.createOrder)

/* router
  .get("/orders/:id", verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), OrderController.listOrdersByUserId)
  .get("/orders/totalsales", OrderController.listOrdersTotalSales) */





export default router;