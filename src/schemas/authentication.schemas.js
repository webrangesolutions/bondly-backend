import Joi from "joi";
import { emailSchema, encryptedOtpTokenSchema, locationSchema, newLocationSchema, otpSchema, passwordSchema, phoneSchema } from "./fields.schemas.js";

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
//schema by sameem
export const sendOtpSchema = Joi.object({
    email: Joi.string().optional().custom((value, helpers) => {
        const emailPattern = /.+@.+\..+/;
        if (value && !emailPattern.test(value)) {
            return helpers.message('email must be a valid email address');
        }
        return value;
    }),
    // phone: Joi.string().optional().custom((value, helpers) => {
    //     const phonePattern = /^\d+$/;
    //     if (value && !phonePattern.test(value)) {
    //         return helpers.message('phone must be a valid phone number');
    //     }
    //     return value;
    // })
    phone: phoneSchema
}).custom((value, helpers) => {
    if (!value.email && !value.phone) {
        return helpers.message('Either email or phone is required');
    }
    if (value.email && value.phone) {
        return helpers.message('Only one of email or phone should be provided');
    }
    
    return value;
});
export const verifyOtpSchema = Joi.object({
    email: Joi.string().optional().custom((value, helpers) => {
        const emailPattern = /.+@.+\..+/;
        if (value && !emailPattern.test(value)) {
            return helpers.message('email must be a valid email address');
        }
        return value;
    }),
    // phone: Joi.string().optional().custom((value, helpers) => {
    //     const phonePattern = /^\d+$/;
    //     if (value && !phonePattern.test(value)) {
    //         return helpers.message('phone must be a valid phone number');
    //     }
    //     return value;
    // }),
    phone: phoneSchema,
    otp: otpSchema.required()
}).custom((value, helpers) => {
    if (!value.email && !value.phone) {
        return helpers.message('Either email or phone is required');
    }
    if (value.email && value.phone) {
        return helpers.message('Only one of email or phone should be provided');
    }
    return value;
});

//
export const registerUserAccountSchema = Joi.object({
    email: emailSchema.required(),
    phone: phoneSchema.required(),
    firstName: Joi.string().min(1).required(),
    lastName: Joi.string().min(1).required(),
    address: Joi.string().min(1).required(),
    location: newLocationSchema.required(),
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