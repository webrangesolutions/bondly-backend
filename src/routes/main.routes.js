import express from "express";
import { assignHTTPError, errorResponder, invalidPathHandler } from "../middlewares/error.middlewares.js";
import petOwnerRouter from "./petOwner.routes.js";
import authRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";

const router = express.Router();

router.use('/auth', authRouter)
router.use('/petOwner', petOwnerRouter);
router.use('/user', userRouter)
router.use(assignHTTPError);
router.use(errorResponder);
router.use(invalidPathHandler);

export default router;