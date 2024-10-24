import express from "express";
import { errorHandler } from "../handlers/error.handlers.js";
import { authGuard } from "../middlewares/auth.middlewares.js";
import chatController from "../controllers/chat.controllers.js";


const chatRouter = express.Router();
chatRouter.get(
    '/:senderId/:recieverId',
    errorHandler(chatController.getAllChat)
);
export default chatRouter;
