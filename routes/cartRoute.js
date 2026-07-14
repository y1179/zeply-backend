import express from 'express'
import { addTocart,removeFromcart,getCart } from '../controllers/cartController.js'
import auth from '../middleware/auth.js';

const app=express.Router();

app.post("/add",auth ,addTocart);

app.post("/remove",auth,removeFromcart)

app.post('/get',auth,getCart)

export default app;