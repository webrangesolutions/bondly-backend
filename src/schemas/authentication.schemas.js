import Joi from "joi";
import { emailSchema, encryptedOtpTokenSchema, locationSchema, otpSchema, passwordSchema, phoneSchema } from "./fields.schemas.js";

export const  sendEmailOTPSchema = Joi.object({
    email: emailSchema.required()
})


export const verifyEmailOTPSchema = Joi.object({
    email: emailSchema.required(),
    otp: otpSchema.required()
})

export const sendPhoneOTPSchema = Joi.object({
    phone: phoneSchema.required()
})

export const verifyPhoneOTPSchema = Joi.object({
    phone: phoneSchema.required(),
    otp: otpSchema.required()
})


export const registerPetOwnerAccountSchema = Joi.object({
    email: emailSchema.required(),
    phone: phoneSchema.required(),
    firstName: Joi.string().min(1).required(),
    lastName: Joi.string().min(1).required(),
    address: Joi.string().min(1).required(),
    location: locationSchema.required(),
    dob: Joi.date().required()
})

export const createPasswordSchema = Joi.object({
    email: emailSchema.required(),
    password: passwordSchema.required()
})

export const loginSchema = Joi.object({
    email: emailSchema.required(),
    password: passwordSchema.required()
})