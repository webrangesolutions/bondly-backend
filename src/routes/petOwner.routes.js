import express from "express";
import { errorHandler } from "../handlers/error.handlers.js";
import { authGuard } from "../middlewares/auth.middlewares.js";
import petOwnerController from "../controllers/petOwner.controllers.js";
import { upload } from "../middlewares/upload.middlewares.js";
import { bodyValidator } from "../middlewares/bodySchema.middlewares.js";
import { addPetSchema } from "../schemas/pet.schemas.js";
import petController from "../controllers/pet.controllers.js";

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

//-------------Pets---------------//
petOwnerRouter.post('/pets',
    upload.single("image"),
    authGuard("petOwner"),
    bodyValidator(addPetSchema),
    errorHandler(petController.addPetByPetOwner)
)
export default petOwnerRouter;