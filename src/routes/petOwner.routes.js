import express from "express";
import { errorHandler } from "../handlers/error.handlers.js";
import { authGuard } from "../middlewares/auth.middlewares.js";
import petOwnerController from "../controllers/petOwner.controllers.js";
import { multipleUploads, upload } from "../middlewares/upload.middlewares.js";
import { bodyValidator } from "../middlewares/bodySchema.middlewares.js";
import { addPetSchema } from "../schemas/pet.schemas.js";
import petController from "../controllers/pet.controllers.js";

const petOwnerRouter = express.Router();

//---------------Profile-------------------//
//Get My Profile//
petOwnerRouter.get(
  "/me",
  authGuard("petOwner"),
  errorHandler(petOwnerController.getMyProfile)
);

//Update Profile//
petOwnerRouter.put(
  "/me",
  upload.single("profileImage"),
  authGuard("petOwner"),
  errorHandler(petOwnerController.updateMyProfile)
);

//-------------Pets---------------//
petOwnerRouter.post(
  "/pets",
  upload.single("image"),
  authGuard("petOwner"),
  bodyValidator(addPetSchema),
  errorHandler(petController.addPetByOwner)
);

petOwnerRouter.get(
  "/me/pets/",
  authGuard("petOwner"),
  errorHandler(petController.getPetsByPetOwnerId)
);
petOwnerRouter.post(
  "/me/walkInRequest",
  // upload.single("image"),
  authGuard("petOwner"),
  // bodyValidator(),
  errorHandler(petOwnerController.addPetWalkRequest)
);
petOwnerRouter.post(
  "/me/dropInRequest",
  // upload.single("image"),
  authGuard("petOwner"),
  // bodyValidator(),
  errorHandler(petOwnerController.addDropInRequest)
);
petOwnerRouter.post(
  "/me/sittingRequest",
  // upload.single("image"),
  authGuard("petOwner"),
  // bodyValidator(),
  errorHandler(petOwnerController.addPetSittingRequest)
);

petOwnerRouter.get(
  "/me/getPetOwnerRequests",
  authGuard("petOwner"),
  errorHandler(petOwnerController.getPetOwnerRequests)
);


petOwnerRouter.get('/me/getPetOwnerRequests',
  authGuard("petOwner"),
  errorHandler(petOwnerController.getPetOwnerRequests)
)

petOwnerRouter.post('/me/addFavouritePetCarer',
  authGuard("petOwner"),
  // bodyValidator(),
  errorHandler(petOwnerController.addFavouritePetCarer)
)
petOwnerRouter.get('/me/getFavouritePetCarer',
  authGuard("petOwner"),
  errorHandler(petOwnerController.getFavouritePetCarer)
)
petOwnerRouter.patch('/me/updateFavouritePetCarer',
  authGuard("petOwner"),
  errorHandler(petOwnerController.updateFavouritePetCarer)
)
petOwnerRouter.delete('/me/deleteFavouritePetCarer',
  authGuard("petOwner"),
  errorHandler(petOwnerController.deleteFavouritePetCarer)
)
petOwnerRouter.patch(
  '/me/acceptOrderRequest',
  authGuard("petOwner"),
  errorHandler(petOwnerController.acceptOrderByPetOwner)
);

petOwnerRouter.post(
  "/me/meetAndGreet/:id",
  authGuard("petOwner"),
  // bodyValidator(),
  errorHandler(petOwnerController.meetAndGreet)
);

petOwnerRouter.post(
  "/me/goodFeedbackAndRating",
  authGuard("petOwner"),
  // bodyValidator(),
  errorHandler(petOwnerController.goodFeedbackAndRating)
);

petOwnerRouter.post(
  "/me/badFeedbackAndRating",
  multipleUploads,
  authGuard("petOwner"),
  // bodyValidator(),
  errorHandler(petOwnerController.badFeedbackAndRating)
);


petOwnerRouter.post(
  "/me/removeAsFavourite",
  authGuard("petOwner"),
  // bodyValidator(),
  errorHandler(petOwnerController.removeAsFavourite)
);

petOwnerRouter.post(
  "/me/badMeetAndGreetFeedback",
  authGuard("petOwner"),
  // bodyValidator(),
  errorHandler(petOwnerController.badMeetAndGreetFeedback)
);

petOwnerRouter.post(
  "/me/goodMeetAndGreetFeedback",
  authGuard("petOwner"),
  // bodyValidator(),
  errorHandler(petOwnerController.goodMeetAndGreetFeedback)
);
export default petOwnerRouter;
