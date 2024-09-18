import express from "express";
import { authGuard } from "../middlewares/auth.middlewares.js";
import { errorHandler } from "../handlers/error.handlers.js";
import adminController from "../controllers/admin.controllers.js";

const adminRouter = express.Router();

//-------------Profile--------------//

adminRouter.post('/uploadSignupVideo',
    authGuard('admin'),
    errorHandler(adminController.getMyProfile)
)

export default adminRouter;