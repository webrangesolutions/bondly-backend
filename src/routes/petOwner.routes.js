import express from "express";
import { errorHandler } from "../handlers/error.handlers.js";
import { authGuard } from "../middlewares/auth.middlewares.js";
import petOwnerController from "../controllers/petOwner.controllers.js";

const petOwnerRouter = express.Router();

//---------------Profile-------------------//
//Get My Profile//
petOwnerRouter.get('/me', 
    authGuard("petOwner"),
    errorHandler(petOwnerController.getMyProfile)
)
//Update Profile//
petOwnerRouter.put('/me', (req, res, next)=>{
    throw Error("Not Implemented Yet");
})

export default petOwnerRouter;