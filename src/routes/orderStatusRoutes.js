import express from "express";
import orderStatusController from "../controllers/orderStatusController.js";
import verifyJWT from "../middlewares/verifyJWT.js";
import verifyRoles from "../middlewares/verifyRoles.js";
import ROLES_LIST from "../config/roles_list.js";

const router = express.Router();

router.route("/orderStatus")
  .get(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), orderStatusController.listOrdersStatus)
  .post(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),orderStatusController.createOrderStatus)
 
  router.route("/orderStatus/:id")
  .get(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), orderStatusController.listOrderStatusById)
  .put(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee),orderStatusController.updateOrderStatus)
  .delete(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), orderStatusController.deleteOrderStatus)



export default router;