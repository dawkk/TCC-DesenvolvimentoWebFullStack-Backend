import express from "express";
import MenuController from "../controllers/menusController.js";
import verifyJWT from "../middlewares/verifyJWT.js";
import verifyRoles from "../middlewares/verifyRoles.js";
import ROLES_LIST from "../config/roles_list.js";

const router = express.Router();

router.route("/menus")
  .get(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), MenuController.listMenus)
  .post(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),MenuController.createMenu)
 
  router.route("/menus/:id")
  .get(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee),MenuController.listMenuById)
  .put(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),MenuController.updateMenu)
  .delete(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), MenuController.deleteMenu)



export default router;