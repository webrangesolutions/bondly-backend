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
    '/me/pets',
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
petCarerRouter.post(
    '/me/applyToOrder',
    authGuard("petCarer"),
    errorHandler(petCarerController.applyToOrder)
);
petCarerRouter.delete(
    '/me/cancelOrderByPetCarer',
    authGuard("petCarer"),
    errorHandler(petCarerController.cancelOrderByPetCarer)
);
petCarerRouter.patch(
    '/me/startOrderByPetCarer',
    authGuard("petCarer"),
    errorHandler(petCarerController.startOrderByPetCarer)
);
petCarerRouter.patch(
    '/me/completeOrderByPetCarer',
    authGuard("petCarer"),
    errorHandler(petCarerController.completeOrderByPetCarer)
);

// petCarerRouter.patch(
//     '/me/updateRating',
//     authGuard("petCarer"),
//     errorHandler(petCarerController.updateRating)
// );
// petCarerRouter.patch(
//     '/me/updatePoints',
//     authGuard("petCarer"),
//     errorHandler(petCarerController.updatePoints)
// );
petCarerRouter.post(
    '/me/contactus',
    authGuard("petCarer"),
    errorHandler(petCarerController.contactus)
);

petCarerRouter.post(
    "/me/petCarerFeedback",
    multipleUploads,
    authGuard("petCarer"),
    // bodyValidator(),
    errorHandler(petCarerController.petCarerFeedback)
);
petCarerRouter.post(
    "/me/meetAndGreetFeedback",
    authGuard("petCarer"),
    // bodyValidator(),
    errorHandler(petCarerController.meetAndGreetFeedback)
);
export default petCarerRouter;
