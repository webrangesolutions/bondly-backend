import express from "express";
import { errorHandler } from "../handlers/error.handlers.js";
import { authGuard } from "../middlewares/auth.middlewares.js";
import petOwnerController from "../controllers/petOwner.controllers.js";
import { upload } from "../middlewares/upload.middlewares.js";

const petOwnerRouter = express.Router();

//---------------Profile-------------------//
//Get My Profile//
petOwnerRouter.get('/me', 
    authGuard("petOwner"),
    errorHandler(petOwnerController.getMyProfile)
)
//Update Profile//
petOwnerRouter.put('/me',
    upload.single("profileImage"),
    authGuard("petOwner"),
    errorHandler(petOwnerController.updateMyProfile)
)

export default petOwnerRouter;