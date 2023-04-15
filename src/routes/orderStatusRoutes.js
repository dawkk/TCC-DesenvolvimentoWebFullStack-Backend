import express from "express";
import orderStatusController from "../controllers/orderStatusController.js";
import verifyJWT from "../middlewares/verifyJWT.js";
import verifyRoles from "../middlewares/verifyRoles.js";
import ROLES_LIST from "../config/roles_list.js";

const router = express.Router();

router
  .get("/orderStatus/:id", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), orderStatusController.listOrderStatusById)
  .put("/orderStatus/:id", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), orderStatusController.updateOrderStatus)
  .delete("/orderStatus/:id", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), orderStatusController.deleteOrderStatus)
  .get("/orderStatus", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), orderStatusController.listOrdersStatus)
  .post("/orderStatus", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), orderStatusController.createOrderStatus)



export default router;