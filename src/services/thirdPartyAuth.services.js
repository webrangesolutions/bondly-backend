import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model.js";
import userServices from "./user.services.js";
import verifiedCredentialsServices from "./verifiedCredentials.services.js";


const thirdPartyAuthServices = {
    async verifyGoogleToken(idToken){
        let client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        
        //Check if User Already Exists//
        let user = await User.findOne({email: payload.email})
        let resBody = null;
        let message = null;
        if(!user)
        {
            await verifiedCredentialsServices.verifyEmail(payload.email);
            message = "Email has been verified successfully";
            resBody = {email: payload.email};
        }
        else{
            resBody = await userServices.getUserPayload(user);
            message = "User has logged in successfully";
        }

       return {message, resBody};
    },

    async verifyAppleToken(idToken){
        const decodedToken = jwt.verify(idToken, process.env.APPLE_PUBLIC_KEY, { algorithms: ['ES256'] });

        //Check if User Already Exists//
        let user = await User.findOne({email: decodedToken.email})
        let resBody = null;
        let message = null;
        if(!user)
        {
            await verifiedCredentialsServices.verifyEmail(decodedToken.email);
            message = "Email has been verified successfully";
            resBody = {email: decodedToken.email};
        }
        else{
            resBody = await userServices.getUserPayload(user);
            message = "User has logged in successfully";
        }

       return {message, resBody};
    }
}

export default thirdPartyAuthServices;