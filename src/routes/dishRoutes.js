import express from "express";
import DishController from "../controllers/dishesController.js";
import verifyJWT from "../middlewares/verifyJWT.js";
import verifyRoles from "../middlewares/verifyRoles.js";
import ROLES_LIST from "../config/roles_list.js";

const router = express.Router();

router
  .post("/dishes/:id/image", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), DishController.uploadDishImage)
  .get("/dishes/:id/image", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), DishController.getDishImage)
  .get("/dishes/all", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), DishController.listAllDishes)
  .get("/dishes/search", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), DishController.listDishByType)
  .get("/dishes/:id", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), DishController.listDishById)
  .put("/dishes/:id", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), DishController.updateDish)
  .delete("/dishes/:id", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), DishController.deleteDish)
  .get("/dishes/:menuId", DishController.listDishesFrontend)
  .get("/dishes", DishController.listDishesFrontend)
  .post("/dishes", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), DishController.createDish)


export default router;