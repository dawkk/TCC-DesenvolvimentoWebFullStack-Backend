import express from "express";
import users from "./userRoutes.js";
import dishes from "./dishRoutes.js"
import menus from "./menuRoutes.js"
import orders from "./orderRoutes.js"

const routes = (app) => {
  app.route('/').get((req, res) => {
    res.status(200).send({})
  })

  app.use(
    express.json(),
    dishes,
    menus,
    users,
    orders
  )
}

export default routes;