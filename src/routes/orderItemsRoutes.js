import express from "express";
import verifyJWT from "../middlewares/verifyJWT.js";
import verifyRoles from "../middlewares/verifyRoles.js";
import ROLES_LIST from "../config/roles_list.js";
import OrderItemsController from "../controllers/orderItemsController.js";

const router = express.Router();

router
  .get("/orderItems/me/order/:id", verifyJWT, OrderItemsController.listSelfAllOrderItemsByOrderId)
  .put("/orderItems/me/order/:id", verifyJWT, OrderItemsController.updateSelfOrderItem)
  .delete("/orderItems/me/order/:id", verifyJWT, OrderItemsController.deleteSelfOrderItem)
  .get("/orderItems/order/:id", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), OrderItemsController.listOrderItemsByOrderId)
  .post("/orderItems/me", verifyJWT, OrderItemsController.createSelfOrderItem)
  .get("/orderItems/me", verifyJWT, OrderItemsController.listSelfAllOrderItems)
  .get("/orderItems/:id", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), OrderItemsController.listOrderItemById)
  .put("/orderItems/:id", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), OrderItemsController.updateOrderItem)
  .delete("/orderItems/:id", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), OrderItemsController.deleteOrderItem)
  .get("/orderItems", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), OrderItemsController.listAllOrderItems)
  .post("/orderItems", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), OrderItemsController.createOrderItem)


export default router;