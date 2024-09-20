import express from "express";
import { authGuard } from "../middlewares/auth.middlewares.js";
import { errorHandler } from "../handlers/error.handlers.js";
import fileManagementController from "../controllers/filesManagement.controllers.js";
import { upload } from "../middlewares/upload.middlewares.js";
// import adminController from "../controllers/admin.controllers.js";

const adminRouter = express.Router();

//-------------Profile--------------//

adminRouter.post('/uploadSignupVideo',  upload.single("file"),
    // authGuard('admin'),
    errorHandler(fileManagementController.uploadSignupVideo)
)

export default adminRouter;