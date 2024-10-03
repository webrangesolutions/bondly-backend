import createHttpError from "http-errors";
import Pet from "../models/pet.model.js";
import PetOwner from "../models/petOwner.model.js";
import User from "../models/user.model.js";
import petOwnerRepository from "../repositories/petOwner.repositories.js";
import { uploadFileToFirebase } from "./storage.services.js";

const petServices = {
    async addPet(petOwnerId, image, type, name, breed, physicalAttributes, dob, 
        homeAddress, spayedOrCastrated, microchipNumber, hobbies, favouriteActivities, fearsAndTriggers, 
        clinicName, veterainDoctorName, clinicAddress, clinicCountryCode, clinicPhoneNumber, medicalHistory, specialNotes, size){
        
        let petOwner = await PetOwner.findById(petOwnerId);
        
        if(!petOwner)
            throw new createHttpError.NotFound("Pet Owner not found");

        let pet = new Pet({
            petOwner: petOwnerId,
            clinicPhoneNumber: {
                countryCode: clinicCountryCode,
                number: clinicPhoneNumber
            },
            type, name, breed, physicalAttributes, dob, homeAddress, 
            spayedOrCastrated, microchipNumber, hobbies, favouriteActivities, fearsAndTriggers, clinicName, 
            veterainDoctorName, clinicAddress, medicalHistory, specialNotes, size
        })

        pet.imageUrl = await uploadFileToFirebase(`pets/${pet._id}`, "image", image);

        petOwner.pets.push(pet._id);

        await pet.save();
        await petOwner.save();

        return {pet};
    }
}

export default petServices;