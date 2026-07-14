// import express from "express"
// import cors from "cors"
// import { connectDB } from "./config/db.js"
// import foodRouter from "./routes/foodRoute.js"
// import userRouter from "./routes/userRoute.js"
// import cartRouter from "./routes/cartRoute.js"
// import orderRouter from "./routes/orderRoute.js"
// import 'dotenv/config'
// const app = express()
// const port = 3000

// //middleware
// app.use(express.json())
// app.use(cors())

// //db connection

// connectDB();

// //api end points
// app.use('/api/food',foodRouter)
// app.use("/images",express.static('uploads'))
// app.use("/api/user",userRouter)
// app.use("/api/cart",cartRouter)
// app.use("/api/order",orderRouter)


// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })


import express from "express"
import cors from "cors"
import 'dotenv/config'
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import aiRouter from "./routes/aiRoute.js";
const app = express()
const port = process.env.PORT || 4000

// middleware
app.use(express.json())
app.use(cors())

// db connection
connectDB();

// api endpoints
app.use('/api/food', foodRouter)
app.use("/images", express.static('uploads'))
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)
app.use(
"/api/ai",
aiRouter
);
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})