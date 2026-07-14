import express from "express"
import { placeOrder, userOrders, verifyOrder } from "../controllers/orderController.js"
import auth from "../middleware/auth.js"

const app=express.Router()

app.post("/place",auth,placeOrder)
app.post("/verify",verifyOrder)
app.get("/userorders",auth,userOrders)

export default app;