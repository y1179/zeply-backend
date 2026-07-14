import express from 'express'
import { loginUser,regUser } from '../controllers/userController.js'

const app=express.Router();

app.post("/register",regUser)
app.post("/login",loginUser)

export default app;