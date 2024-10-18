import express from "express";
import { errorHandler } from "../handlers/error.handlers.js";
import { authGuard } from "../middlewares/auth.middlewares.js";
import { bodyValidator } from "../middlewares/bodySchema.middlewares.js";
import { _addPetSchema } from "../schemas/pet.schemas.js";
import petController from "../controllers/pet.controllers.js";
import petCarerController from "../controllers/petCarer.controllers.js";
import { upload, multipleUploads } from "../middlewares/upload.middlewares.js";
const petCarerRouter = express.Router();


//---------------Profile-------------------//
//Get My Profile//
petCarerRouter.get('/me',
    authGuard("petCarer"),
    errorHandler(petCarerController.getMyProfile)
)
//Update Profile//
petCarerRouter.patch('/me',
    upload.single("profileImage"),
    authGuard("petCarer"),
    errorHandler(petCarerController.updateMyProfile)
)

//-------------Pets---------------//
petCarerRouter.post(
    '/pets',
    multipleUploads,
    authGuard("petCarer"),
    errorHandler(petController.addPetByPetCarer)
);


petCarerRouter.get('/me/getPetCarerRequests',
    authGuard("petCarer"),
    errorHandler(petCarerController.getPetCarerRequests)
)

petCarerRouter.post(
    '/me/identityVerification',
    multipleUploads,
    authGuard("petCarer"),
    errorHandler(petCarerController.identityVerification)
);
petCarerRouter.get(
    '/me/identityVerification',
    authGuard("petCarer"),
    errorHandler(petCarerController.getIdentityVerification)
);

export default petCarerRouter;
