import createError from "http-errors";
import User from "../models/user.model.js"
import otpGenerator from "otp-generator";
import { getForgotPasswordTemplate, getSignupOtpTemplate } from "../email-templates/authentication.templates.js";
import emailsServices from "./emails.services.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import util from "util";
import PetOwner from "../models/petOwner.model.js";
import verifiedCredentialsServices from "./verifiedCredentials.services.js";
import createHttpError from "http-errors";
import { createEncryptedJWT, decryptedEJWT } from "../utils/encrypted-payloads.js";
import PetCarer from "../models/petCarer.model.js";
const userServices = {
    async sendSignupOtpToEmail(email) {
        let user = await User.findOne({ email });

        if (user)
            throw new createError.Conflict("A user with current email already exists")

        let otp = await verifiedCredentialsServices.assignOtpToEmail(email);

        let subject = "OTP for Signing Up to " + process.env.APP_NAME
        let body = getSignupOtpTemplate(otp);

        await emailsServices.sendEmail(email, subject, body);
    },

    async verifySignUpEmail(email, otp) {
        await verifiedCredentialsServices.verifyOtpForEmail(email, otp);
    },

    async sendSignupOtpToPhone(phone) {
        let user = await User.findOne({ phone });

        if (user)
            throw new createError.Conflict("A user with current email already exists")

        let otp = await verifiedCredentialsServices.assignOtpToPhone(phone);

        let message = "Otp for Signing up is " + otp;

        return {
            message
        }
    },

    async verifySignUpPhone(phone, otp) {
        await verifiedCredentialsServices.verifyOtpForPhone(phone, otp);
    },

    async createPassword(email, password) {
        await verifiedCredentialsServices.isEmailVerified(email);

        let user = await User.findOne({ email });

        if (!user)
            throw new createError.NotFound("User not found with given email id.");

        let salt = await bcrypt.genSalt(10);

        let hashPassword = util.promisify(bcrypt.hash);

        let encryptedPassword = await hashPassword(password, salt);

        user.password = encryptedPassword;

        await user.save();

        return { user }
    },

    async sendForgotPasswordOtpToEmail(email) {
        let user = await User.findOne({ email });

        if (!user)
            throw new createError.NotFound("User doesn't exist with given email")

        let otp = await verifiedCredentialsServices.assignOtpToEmail(email)

        let subject = "OTP for Forgeting Password to " + process.env.APP_NAME
        let body = getForgotPasswordTemplate(user.firstName, otp);

        await emailsServices.sendEmail(email, subject, body);
    },

    async verifyForgotPasswordEmail(email, otp) {
        await verifiedCredentialsServices.verifyOtpForEmail(email, otp);


        let user = await User.findOne({ email });

        if (!user)
            throw new createHttpError.NotFound("User not found with given email");


    },

    async registerPetOwnerAccount(email, phone, firstName,
        lastName, address, location, dob) {
        await verifiedCredentialsServices.isEmailVerified(email);

        await verifiedCredentialsServices.isPhoneVerified(phone)

        let user = new User({
            email: email,
            phone,
            firstName,
            lastName,
            roles: ["petOwner"],
            dob
        });

        await user.save().catch((err) => {
            if (err.code === 11000) {
                throw new createHttpError.BadRequest("User already exists with given credentials");
            } else {
                throw err
            }
        });

        let petOwner = new PetOwner({
            user: user._id,
            address,
            location,
        });

        await petOwner.save();

        return { user, petOwner }
    },

    async registerUserAccount(email, phone, firstName,
        lastName, location, dob) {
        await verifiedCredentialsServices.isEmailVerified(email);

        await verifiedCredentialsServices.isPhoneVerified(phone)

        let user = new User({
            email: email,
            phone,
            firstName,
            lastName,
            roles: ["petCarer"],
            dob
        });

        await user.save().catch((err) => {
            if (err.code === 11000) {
                throw new createHttpError.BadRequest("User already exists with given credentials");
            } else {
                throw err
            }
        });
        let petCarer = new PetCarer({
            user: user._id,
            location: {
                lat: location.lat,
                lng: location.lng,
                name: location.name
            },
            createdBy: user._id
        });
        await petCarer.save().catch((err) => {
            throw new createHttpError.InternalServerError("Failed to create Pet Carer");
        });

        return { user, petCarer }
    },

    async getUserProfile(userId) {
        let user = await User.findById(userId);

        if (!user)
            throw new createError.NotFound("User with given information doesn't exist");

        let resBody = {
            user
        }

        if (user.roles.findIndex((val) => val == "petOwner") > -1) {
            let petOwner = await PetOwner.findOne({ user: user._id });
            resBody.petOwner = petOwner;
        }

        if (user.roles.findIndex((val) => val == "petCarer") > -1) {
            let petCarer = await PetCarer.findOne({ user: user._id });
            resBody.petCarer = petCarer;
        }

        return resBody
    },

    async signInAccount(email, password) {
        let user = await User.findOne({ email });

        if (!user)
            throw new createError.NotFound("User with given information doesn't exist");

        if (!user.password)
            throw new createError.BadRequest("User's password is not set, please create one first");

        let passwordMatched = await bcrypt.compare(password, user.password).catch((err) => {
            throw new createError.BadRequest(err.message);
        })

        if (!passwordMatched)
            throw new createError.Unauthorized("Password doesn't match");

        let resBody = await this.getUserPayload(user);

        return resBody
    },

    async getMyProfile(userId) {
        let user = await User.findById(userId);

        if (!user)
            throw new createError.NotFound("User doesn't exist found");

        let resBody = {
            user
        }

        if (user.roles.includes("petOwner")) {
            let petOwner = await PetOwner.findOne({ user: userId });
            resBody.petOwner = petOwner;
        }

        if (user.roles.includes("petCarer")) {
            let petCarer = await PetCarer.findOne({ user: userId });
            resBody.petCarer = petCarer;
        }

        return resBody
    },

    async getUserPayload(user) {
        let payload = {
            user: user._id,
            roles: ["user"]
        }

        let resBody = {
            user
        }

        if (user.roles.findIndex((val) => val == "petOwner") > -1) {
            let petOwner = await PetOwner.findOne({ user: user._id });
            resBody.petOwner = petOwner;
            payload.petOwner = petOwner._id;
            payload.roles.push("petOwner")
        }

        if (user.roles.findIndex((val) => val == "petCarer") > -1) {
            let petCarer = await PetCarer.findOne({ user: user._id });
            resBody.petCarer = petCarer;
            payload.petCarer = petCarer._id;
            payload.roles.push("petCarer")
        }

        let authToken = jwt.sign(payload, process.env.JWT_AUTHENTICATION_SECRET);
        resBody.authToken = authToken;

        return resBody;
    }
}

export default userServices;