import PetOwner from "../models/petOwner.model.js";
import User from "../models/user.model.js";
import petOwnerRepository from "../repositories/petOwner.repositories.js";
import { uploadFileToFirebase } from "./storage.services.js";

const petOwnerServices = {
    async getSpecificPetOwner(id){
        let petOwner = await petOwnerRepository.getSpecificPetOwner(id);

        return {petOwner}
    },

    async updateSpecificPetOwner(petOwnerId, firstName, lastName, dob, address,
        locationLat, locationLng, emergencyNumber, profileImage){

        //Getting Pet Owner and User
        let petOwner = await PetOwner.findById(petOwnerId);

        let user = await User.findById(petOwner.user);

        // Updating User
        let profileImageUrl;

        if(profileImage){
            profileImageUrl = await uploadFileToFirebase(`/users/${user._id}/`, "profileImage", profileImage);
            user.profileImageUrl = profileImageUrl;
        }

        if(firstName) user.firstName = firstName;
        if(lastName) user.lastName = lastName;
        if(dob) user.dob = dob;
    
        //Updating Pet Owner
        if(address) petOwner.address = address;
        if(locationLat) petOwner.location.lat = locationLat;
        if(locationLng) petOwner.location.lng = locationLng;
        if(emergencyNumber) petOwner.emergencyNumber = emergencyNumber;

        await petOwner.save();
        await user.save();

        return {
            petOwner: {
                ...user.toObject(),
                ...petOwner.toObject()
            }
        }
    }
}

export default petOwnerServices;