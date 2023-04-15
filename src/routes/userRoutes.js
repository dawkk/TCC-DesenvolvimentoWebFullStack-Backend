import express from "express";
import UserController from "../controllers/userController.js";
import verifyJWT from "../middlewares/verifyJWT.js";
import verifyRoles from "../middlewares/verifyRoles.js";
import ROLES_LIST from "../config/roles_list.js";
import handleRefreshToken from "../controllers/refreshTokenController.js"

const router = express.Router();

/* quando projetar rotas precisamos colocar no topo da mais especifica para a menos especifica, ou teremos erros de código
*/
router
  .get("/users/me/addresses", verifyJWT, UserController.listUserAddress)
  .post("/users/me/addresses", verifyJWT, UserController.createUserAddress)
  .put("/users/me/addresses/:id", verifyJWT, UserController.updateUserAddress)
  .delete("/users/me/addresses/:id", verifyJWT, UserController.deleteUserAddress)
  .get("/users/me", verifyJWT, UserController.listSelf)
  .put("/users/me", verifyJWT, UserController.updateSelf)
  .get("/users/search", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), UserController.listUserByEmail)
  .get("/users/:id", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), UserController.listUserById)
  .put("/users/:id", verifyJWT, verifyRoles(ROLES_LIST.Admin), UserController.updateUser)
  .delete("/users/:id", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), UserController.deleteUser)
  .get("/users", verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), UserController.listAllUsers)
  .post("/users", UserController.createUser)
  .post("/auth/login", UserController.loginUser)
  .get("/auth/logout", UserController.logoutUser)

/* .post("/refresh", handleRefreshToken) */

export default router;