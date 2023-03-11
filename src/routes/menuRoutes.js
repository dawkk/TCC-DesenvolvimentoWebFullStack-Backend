import express from "express";
import MenuController from "../controllers/menusController.js";

const router = express.Router();

router.route("/menus")
  .get(MenuController.listMenus)
  .post(MenuController.createMenu)
 
  router.route("/menus/:id")
  .get(MenuController.listMenuById)
  .put(MenuController.updateMenu)
  .delete(MenuController.deleteMenu)



export default router;