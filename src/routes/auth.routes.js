import express from "express";
import { bodyValidator } from "../middlewares/bodySchema.middlewares.js";
import { createPasswordSchema, loginSchema, registerPetOwnerAccountSchema, sendEmailOTPSchema, sendPhoneOTPSchema, verifyEmailOTPSchema, verifyPhoneOTPSchema } from "../schemas/authentication.schemas.js";
import { errorHandler } from "../handlers/error.handlers.js";
import userController from "../controllers/user.controllers.js";
import passport from "passport";

const authRouter = express.Router();

//-------------Authentication Routes--------------//
//Sign Up//
authRouter.post('/signup/sendEmailOTP', 
    bodyValidator(sendEmailOTPSchema), 
    errorHandler(userController.sendSignupOtpToEmail)
)

authRouter.post('/signup/verifyEmail', 
    bodyValidator(verifyEmailOTPSchema), 
    errorHandler(userController.verifySignUpEmail)
)
authRouter.post('/signup/sendPhoneOTP', 
    bodyValidator(sendPhoneOTPSchema), 
    errorHandler(userController.sendSignupOtpToPhone)
)
authRouter.post('/signup/verifyPhone', 
    bodyValidator(verifyPhoneOTPSchema), 
    errorHandler(userController.verifySignUpPhone)
)

authRouter.post('/signup/registerPetOwnerAccount',
    bodyValidator(registerPetOwnerAccountSchema), 
    errorHandler(userController.registerPetOwnerAccount)
)

//Create Password//
authRouter.post('/createPassword', 
    bodyValidator(createPasswordSchema), 
    errorHandler(userController.createPassword)
)
//Forgot Password//
authRouter.post('/forgotPassword/sendOTP', 
    bodyValidator(sendEmailOTPSchema), 
    errorHandler(userController.sendForgotPasswordOtpToEmail)
)
authRouter.post('/forgotPassword/VerifyEmail', 
    bodyValidator(verifyEmailOTPSchema), 
    errorHandler(userController.verifyForgotPasswordEmail)
)
//Login//
authRouter.post('/signin',
    bodyValidator(loginSchema),
    errorHandler(userController.signInAccount)
)

authRouter.get('/google',
    passport.authenticate('google', { scope:
        [ 'email', 'profile' ] }
));

authRouter.get( '/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure'
}));
export default authRouter;