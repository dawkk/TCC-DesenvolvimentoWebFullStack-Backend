import express from "express";
import DishController from "../controllers/dishesController.js";
import verifyJWT from "../middlewares/verifyJWT.js";
import verifyRoles from "../middlewares/verifyRoles.js";
import ROLES_LIST from "../config/roles_list.js";

const router = express.Router();

/* REMINDER A ROUTE UNPROTECTED BEFORE HIERARQUY CAN SOMEHOW MESS OTHER ROUTES, TRY TO SEPARATE BY PROTECTION ALSO, FOR ROUTES, IN THIS CASE UNPROTECT ROUTE WAS MESSING OTHERS */

router
  .get("/dishes/:id/image", DishController.getDishImage)
  .post("/dishes/:id/image", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), DishController.uploadDishImage)
  .get("/dishes/:menuId/menu", DishController.listDishesByMenuId)
  .get("/dishes/all", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), DishController.listAllDishes)
  .get("/dishes/search", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), DishController.listDishByType)
  .get("/dishes/:id", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), DishController.listDishById)
  .put("/dishes/:id", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), DishController.updateDish)
  .delete("/dishes/:id", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), DishController.deleteDish)
  .post("/dishes", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), DishController.createDish)
  .get("/dishes", DishController.listDishesFrontend)


export default router;