
import PetCarer from "../models/petCarer.model.js";
import User from "../models/user.model.js";
import petCarerRepository from "../repositories/petCarer.repositories.js";
import { uploadFileToFirebase } from "./storage.services.js";
import validateRequiredFields from "../utils/validationUtils.js";
import createHttpError from "http-errors";
const petCarerServices = {
    async getSpecificPetCarer(id) {
        let petCarer = await petCarerRepository.getSpecificPetCarer(id);

        return { petCarer }
    },
    async updateSpecificPetCarer(petCarerId, firstName, lastName, dob,
        location, profileImage, motivation, languageSpoken, biologicalGender) {

        // Getting Pet Carer and User
        let petCarer = await PetCarer.findById(petCarerId);
        let user = await User.findById(petCarer.user);
        // Check if the required fields are present
        const { valid, message, status } = validateRequiredFields({
            firstName,
            biologicalGender,
            lastName,
            dob,
            languageSpoken,
            motivation
        });

        if (!valid) {
            throw new createHttpError(status, message); // Throw error if fields are missing
        }

        // Updating User
        let profileImageUrl;
        if (profileImage) {
            profileImageUrl = await uploadFileToFirebase(`users/${user._id}`, "profileImage", profileImage);
            user.profileImageUrl = profileImageUrl;
        }

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (dob) user.dob = dob;

        // Updating Pet Carer
        if (location.lat) petCarer.location.lat = location.lat;
        if (location.lng) petCarer.location.lng = location.lng;
        if (location.name) petCarer.location.name = location.name;
        if (biologicalGender) petCarer.biologicalGender = biologicalGender;
        if (languageSpoken) petCarer.languageSpoken = Array.isArray(languageSpoken) ? languageSpoken : [languageSpoken];
        if (motivation) petCarer.motivation = motivation;

        await petCarer.save();
        await user.save();

        return {
            petCarer: {
                ...user.toObject(),
                ...petCarer.toObject()
            }
        };
    }

}

export default petCarerServices;