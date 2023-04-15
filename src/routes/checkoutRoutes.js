import express from "express";
import verifyJWT from "../middlewares/verifyJWT.js";
import verifyRoles from "../middlewares/verifyRoles.js";
import ROLES_LIST from "../config/roles_list.js";
import CheckoutController from "../controllers/checkoutController.js";

const router = express.Router();

router
  .get("/checkouts/me/:id", verifyJWT, CheckoutController.listSelfCheckoutById)
  .put("/checkouts/me/:id", verifyJWT, CheckoutController.updateSelfCheckout)
  .delete("/checkouts/me/:id", verifyJWT, CheckoutController.deleteSelfCheckout)
  .get("/checkouts/me", verifyJWT, CheckoutController.listSelfCheckouts)
  .get("/checkouts/:id", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), CheckoutController.listCheckoutById)
  .put("/checkouts/:id", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), CheckoutController.updateCheckoutById)
  .delete("/checkouts/:id", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), CheckoutController.deleteCheckoutById)
  .get("/checkouts", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), CheckoutController.listAllCheckouts)
  .post("/checkouts", verifyJWT, CheckoutController.createCheckout)

export default router;