import { Crypto } from "cryptojs";
import createError from "http-errors";
import jwt from "jsonwebtoken";


export function createEncryptedJWT(payload, action){
    let verification = {
        payload,
        action
    }
    
    let jwtToken = jwt.sign(verification, process.env.JWT_SECRET_KEY, {expiresIn: process.env.OTP_VALID_TIME*60}); //This Helps in getting Expiry Time
    let encryptedOTPToken = Crypto.AES.encrypt(jwtToken, process.env.OTP_ENCRYPTION_KEY).toString();
    return encryptedOTPToken;
}

export function decryptedEJWT(encryptedOTPToken, action){
    let jwtToken = Crypto.AES.decrypt(encryptedOTPToken, process.env.OTP_ENCRYPTION_KEY).toString();
    let jwtTokenDecrypted = {};
    try{
        jwtTokenDecrypted = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY)
    }
    catch(err){
        throw new createError.BadRequest(err.message)
    }
    if(action != jwtTokenDecrypted.action)
        throw new createError.BadRequest("Token was not generated for " + action)
    delete jwtTokenDecrypted.action
    
    return jwtTokenDecrypted.payload;
}