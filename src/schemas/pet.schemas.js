import Joi from "joi";
import { countryCodeSchema, phoneNumberSchema} from "./fields.schemas.js";

export const  addPetSchema = Joi.object({
      type: Joi.string().required(),
      name: Joi.string().required(),
      breed: Joi.string().required(),
      physicalAttributes: Joi.string().required(),
      dob: Joi.date().required(),
      homeAddress: Joi.string().required(),
      spayedOrCastrated: Joi.boolean().required(),
      microchipNumber: Joi.string().required(),
      hobbies: Joi.string(),
      favouriteActivities: Joi.string(),
      fearsAndTriggers: Joi.string(),
      clinicName:Joi.string().required(),
      veterainDoctorName: Joi.string().required(),
      clinicAddress:Joi.string().required(),
      clinicCountryCode: countryCodeSchema.required(),
      clinicPhoneNumber: phoneNumberSchema.required(),
      medicalHistory: Joi.string(),
      specialNotes: Joi.string(),
      size: Joi.string().required()
})