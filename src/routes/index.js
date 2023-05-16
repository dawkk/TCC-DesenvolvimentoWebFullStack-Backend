import express from "express";
import users from "./userRoutes.js";
import dishes from "./dishRoutes.js"
import menus from "./menuRoutes.js"
import orders from "./orderRoutes.js"
import paymentMethods from "./paymentMethodRoutes.js";
import checkouts from "./checkoutRoutes.js"
import orderItems from "./orderItemsRoutes.js"
import authRouter from "./authRoutes.js";


const routes = (app) => {
  app.route('/').get((req, res) => {
    res.status(200).send({})
  })

  app.use(
    express.json(),
    authRouter,
    dishes,
    menus,
    users,
    orders,
    paymentMethods,
    checkouts,
    orderItems
  )
}

export default routes;