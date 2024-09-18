
import createHttpError from "http-errors";
import VerifiedCredential from "../models/verifiedCredentials.model.js";
import otpGenerator from "otp-generator";

const verifiedCredentialsServices = {
    async assignOtpToEmail(email){
        let otp = otpGenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })

        let verifiedCredential = await VerifiedCredential.findOne({email});

        if(!verifiedCredential)
        {
            verifiedCredential = new VerifiedCredential({email, otp});
        }
        else{
            verifiedCredential.otp = otp;
        }

        await verifiedCredential.save();

        return otp;
    },

    async verifyOtpForEmail(email, otp){
        let verifiedCredential = await VerifiedCredential.findOne({email});

        if(!verifiedCredential)
            throw new createHttpError.BadRequest("Otp for given email has expired, or doesn't exist");

        if(verifiedCredential.otp != otp)
            throw new createHttpError.BadRequest("Otp doesn't match");

        verifiedCredential.verified = true;

        await verifiedCredential.save();
    },

    async isEmailVerified(email){
        let verifiedCredential = await VerifiedCredential.findOne({email, verified: true});

        if(!verifiedCredential)
            throw new createHttpError.BadRequest("Email is not verified");
    },

    async assignOtpToPhone(phone){
        let otp = otpGenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })

        let verifiedCredential = await VerifiedCredential.findOne({phone});

        if(!verifiedCredential)
        {
            verifiedCredential = new VerifiedCredential({phone, otp});
        }
        else{
            verifiedCredential.otp = otp;
        }

        await verifiedCredential.save();

        return otp;
    },

    async verifyOtpForPhone(phone, otp){
        console.log(phone);
        let verifiedCredential = await VerifiedCredential.findOne({phone});

        if(!verifiedCredential)
            throw new createHttpError.BadRequest("Otp for given email has expired, or doesn't exist");

        if(verifiedCredential.otp != otp)
            throw new createHttpError.BadRequest("Otp doesn't match");

        verifiedCredential.verified = true;

        await verifiedCredential.save();
    },

    async isPhoneVerified(phone){
        let verifiedCredential = await VerifiedCredential.findOne({phone, verified: true});

        if(!verifiedCredential)
            throw new createHttpError.BadRequest("Email is not verified");
    },

    async verifyForgotPassword(email, otp){
        let verifiedCredential = await VerifiedCredential.findOne({phone});

        if(!verifiedCredential)
            throw new createHttpError.BadRequest("Otp for given email has expired, or doesn't exist");

        if(verifiedCredential.otp != otp)
            throw new createHttpError.BadRequest("Otp doesn't match");

        verifiedCredential.verified = true;

        await verifiedCredential.save();
    }
}

export default verifiedCredentialsServices;