import express from "express";
import DishController from "../controllers/dishesController.js";

const router = express.Router();

/* quando projetar rotas precisamos colocar no topo da mais especifica para a menos especifica, ou teremos erros de código */

router
  .get("/dishes", DishController.listDishes)
  .get("/dishes/search", DishController.listDishByType)
  .get("/dishes/:id", DishController.listDishById)
  .post("/dishes", DishController.createDish)
  .put("/dishes/:id", DishController.updateDish)
  .delete("/dishes/:id", DishController.deleteDish)
  .post("/dishes/:id/image", DishController.uploadDishImage)
  .get("/dishes/:id/image", DishController.getDishImage)


export default router;