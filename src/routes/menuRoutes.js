import express from "express";
import MenuController from "../controllers/menusController.js";
import verifyJWT from "../middlewares/verifyJWT.js";
import verifyRoles from "../middlewares/verifyRoles.js";
import ROLES_LIST from "../config/roles_list.js";

const router = express.Router();

router
  .post("/menus/:id/image", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), MenuController.uploadMenuImage)
  .get("/menus/:id/image", MenuController.getMenuImage)
  .put("/menus/:id", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), MenuController.updateMenu)
  .delete("/menus/:id", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), MenuController.deleteMenu)
  .get("/menus/:id", MenuController.listMenuById)
  .get("/menus/all", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), MenuController.listAllMenus)
  .post("/menus", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), MenuController.createMenu)
  .get("/menus", MenuController.listMenusFrontend)

export default router;