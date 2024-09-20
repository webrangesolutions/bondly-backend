import express from "express";
import { bodyValidator } from "../middlewares/bodySchema.middlewares.js";
import { createPasswordSchema, loginSchema, registerPetOwnerAccountSchema, sendEmailOTPSchema, sendPhoneOTPSchema, verifyEmailOTPSchema, verifyPhoneOTPSchema } from "../schemas/authentication.schemas.js";
import { errorHandler } from "../handlers/error.handlers.js";
import userController from "../controllers/user.controllers.js";
import passport from "passport";
import { OAuth2Client } from "google-auth-library";

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

authRouter.get( '/google/callback',async (req, res) => {
  const code = req.query.code;
  let oAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
  if (!code) {
    return res.status(400).send('Authorization code not found');
  }

  try {
    // Exchange authorization code for access token
    const { tokens } = await oAuth2Client.getToken(code);
    
    // Set tokens on the OAuth2 client
    oAuth2Client.setCredentials(tokens);
    console.log(tokens);
    // Print the ID token to the console
    console.log('ID Token:', tokens.id_token);

    // Show the ID token to the user in the browser
    res.send(`<h1>ID Token</h1><p>${tokens.id_token}</p>`);
  } catch (error) {
    res.status(500).send('Error during authentication');
  }
}
);

authRouter.get('/verifyGoogleToken',
    errorHandler(userController.verifyGoogleToken)
)

authRouter.get('/google/success', (req, res)=>{
    return res.status(200).send(req.body);
})
export default authRouter;