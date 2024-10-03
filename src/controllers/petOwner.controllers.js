import petOwnerServices from "../services/petOwner.services.js";
import { dataResponse } from "../utils/responses.js";

const petOwnerController = {
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

export default petOwnerController;