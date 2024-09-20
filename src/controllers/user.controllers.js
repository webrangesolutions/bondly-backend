import petOwnerServices from "../services/petOwner.services.js";
import thirdPartyAuthServices from "../services/thirdPartyAuth.services.js";
import userServices from "../services/user.services.js";
import { dataResponse } from "../utils/responses.js";

const userController = {
    async sendSignupOtpToEmail(req, res, next){
        let {email} = req.body;

        await userServices.sendSignupOtpToEmail(email);

        return res.status(200).send(dataResponse("Sign up Otp has been sent to email"))
    },

    async verifySignUpEmail(req, res, next){
        let {email, otp} = req.body;

        await userServices.verifySignUpEmail(email, otp);

        return res.status(200).send(dataResponse("Email has been verified successfully"))
    },

    async sendSignupOtpToPhone(req, res, next){
        let {phone} = req.body;
        
        let resBody = await userServices.sendSignupOtpToPhone(phone);

        return res.status(200).send(dataResponse("Sign up Otp has been sent to Phone", resBody))
    },

    async verifySignUpPhone(req, res, next){
        let {phone, otp} = req.body;

        await userServices.verifySignUpPhone(phone, otp);

        return res.status(200).send(dataResponse("Phone Number has been verified successfully"))
    },

    async registerAccount(req, res, next){
        let {emailCredentialsToken, phoneCredentialsToken, firstName,
            lastName, address, location
        } = req.body;

        let resBody = await userServices.registerAccount(emailCredentialsToken, phoneCredentialsToken, firstName,
            lastName, address, location);

        return res.status(201).send(dataResponse("Account has been created", resBody));
    },

    async createPassword(req, res, next){
        let {email, password} = req.body;

        let resBody = await userServices.createPassword(email, password)

        return res.status(201).send(dataResponse("New password has been created", resBody));
    },

    async sendForgotPasswordOtpToEmail(req, res, next){
        let {email} = req.body;

        await userServices.sendForgotPasswordOtpToEmail(email);

        return res.status(200).send(dataResponse("Otp has been successfully sent to your email"));
    },

    async verifyForgotPasswordEmail(req, res, next){
        let {email, otp} = req.body;

        let resBody  = await userServices.verifyForgotPasswordEmail(email, otp)

        return res.status(200).send(dataResponse("Email has been verified successfully for Reset Password", resBody))
    },

    async signInAccount(req, res, next){
        let {email, password} = req.body;

        let resBody = await userServices.signInAccount(email, password);

        return res.status(201).send(dataResponse("You have successfully logged in", resBody))
    },

    async registerPetOwnerAccount(req, res, next){
        let {email, phone, firstName,
            lastName, address, location
        } = req.body;

        let resBody = await userServices.registerPetOwnerAccount(email, phone, firstName,
            lastName, address, location);

        return res.status(201).send(dataResponse("Account has been created", resBody));
    },

    async getMyProfile(req, res, next){
        let userId = req.user;

        let resBody = await userServices.getMyProfile(userId);

        return res.status(200).send(dataResponse("Profile has been retrieved successfully", resBody))
    },

    async SignupWithGoogle(req, res, next){
        let {id, accessToken} = req.body;

        let resBody = await thirdPartyAuthServices.SignupWithGoogle(id, accessToken);

        return res.status(200).send(dataResponse("Signup", resBody))
    },

    async SignupWithApple(req, res, next){
        let {id, accessToken} = req.body;

        let resBody = await  thirdPartyAuthServices.SignupWithApple(id, accessToken);

        return res.status(200).send(dataResponse("Signup", resBody))
    }
}

export default userController;