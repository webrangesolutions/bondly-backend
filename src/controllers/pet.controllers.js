import createHttpError from "http-errors";
import petOwnerServices from "../services/petOwner.services.js";
import { dataResponse } from "../utils/responses.js";
import petServices from "../services/pet.services.js";

const petController = {
    async addPetByPetOwner(req, res, next){
        let petOwnerId = req.petOwner;

        let image = req.file;

        let {type, name, breed, physicalAttributes, dob, homeAddress,
        spayedOrCastrated, microchipNumber, hobbies, favouriteActivities,
        fearsAndTriggers, clinicName, veterainDoctorName, clinicAddress, clinicCountryCode,
        clinicPhoneNumber, medicalHistory, specialNotes, size} = req.body;

        if(!image)
            throw new createHttpError.BadRequest("Image not found");

        let resBody = await petServices.addPet(petOwnerId, image, type, name, breed, physicalAttributes, dob, 
            homeAddress, spayedOrCastrated, microchipNumber, hobbies, favouriteActivities, fearsAndTriggers, 
            clinicName, veterainDoctorName, clinicAddress, clinicCountryCode, clinicPhoneNumber, medicalHistory, specialNotes, size);
        
        return res.status(201).send(dataResponse("Pet has been added.", resBody));

    },
    async getMyProfile(req, res, next){
        let petOwnerId = req.petOwner;

        let resBody = await petOwnerServices.getSpecificPetOwner(petOwnerId);

        return res.status(200).send(dataResponse("Your petowner profile is successfully fetched", resBody))
    },

    async updateMyProfile(req, res, next){
        let petOwnerId = req.petOwner;

        let profileImage = req.file;

        let {firstName, lastName, locationLat, locationLng, dob, address, emergencyNumber} = req.body;

        let resBody = await petOwnerServices.updateSpecificPetOwner(petOwnerId, firstName, lastName, dob, address,
            locationLat, locationLng, emergencyNumber, profileImage);
        
        return res.status(200).send(dataResponse("Your Pet Owner Profile has been updated", resBody));
    }
}

export default petController;