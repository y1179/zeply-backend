import express from "express";
import {recommendFood} from "../controllers/aiController.js";


const aiRouter=express.Router();


aiRouter.post(
"/recommend",
recommendFood
);


export default aiRouter;