import express from "express";
import UserController from "../controllers/userController.js";
import verifyJWT from "../middlewares/verifyJWT.js";
import verifyRoles from "../middlewares/verifyRoles.js";
import ROLES_LIST from "../config/roles_list.js";
import handleRefreshToken from "../controllers/refreshTokenController.js"

const router = express.Router();

/* quando projetar rotas precisamos colocar no topo da mais especifica para a menos especifica, ou teremos erros de código
*/
router.route("/users/me")
  .get(verifyJWT, UserController.listSelf)
  .put(verifyJWT, UserController.updateSelf)

router.route("/users/search")
  .get(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), UserController.listUserByEmail)

router.route("/users/:id")
  .get(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Employee), UserController.listUserById)
  .put(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), UserController.updateUser)
  .delete(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), UserController.deleteUser)
  
router
  .post("/auth/login", UserController.loginUser)
  .get("/auth/logout", UserController.logoutUser)

router.route("/users")
  .get(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), UserController.listAllUsers)
  .post(UserController.createUser)

/* .post("/refresh", handleRefreshToken) */

export default router;