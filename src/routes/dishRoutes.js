import express from "express";
import DishController from "../controllers/dishesController.js";
import verifyJWT from "../middlewares/verifyJWT.js";
import verifyRoles from "../middlewares/verifyRoles.js";
import ROLES_LIST from "../config/roles_list.js";

const router = express.Router();

/* quando projetar rotas precisamos colocar no topo da mais especifica para a menos especifica, ou teremos erros de código */

router
  .get("/dishes", DishController.listDishes)
  .get("/dishes/search",verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), DishController.listDishByType)
  .get("/dishes/:id",verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), DishController.listDishById)
  .post("/dishes",verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), DishController.createDish)
  .put("/dishes/:id",verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), DishController.updateDish)
  .delete("/dishes/:id",verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), DishController.deleteDish)
  .post("/dishes/:id/image",verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), DishController.uploadDishImage)
  .get("/dishes/:id/image",verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), DishController.getDishImage)


export default router;