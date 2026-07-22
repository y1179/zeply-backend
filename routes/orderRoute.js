// import express from "express"
// import { placeOrder, userOrders, verifyOrder } from "../controllers/orderController.js"
// import auth from "../middleware/auth.js"

// const app=express.Router()

// app.post("/place",auth,placeOrder)
// app.post("/verify",verifyOrder)
// app.get("/userorders",auth,userOrders)

// export default app;


import express from "express";
import { placeOrder, verifyPayment, userOrders } from "../controllers/orderController.js";
import authMiddleware from "../middleware/auth.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", authMiddleware, verifyPayment);
orderRouter.post("/userorders", authMiddleware, userOrders);

export default orderRouter;