import express from "express";
import { errorHandler } from "../handlers/error.handlers.js";
import fileManagementController from "../controllers/filesManagement.controllers.js";
// import adminController from "../controllers/admin.controllers.js";

const indexRouter = express.Router();

//-------------Sign Up--------------//

indexRouter.get('/signupVideo',
    errorHandler(fileManagementController.getSignupVideoLink)
)


export default indexRouter;