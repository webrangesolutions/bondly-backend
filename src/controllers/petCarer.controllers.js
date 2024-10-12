
import petCarerServices from "../services/petCarer.services.js";
import { dataResponse } from "../utils/responses.js";

const petCarerController = {
    async getMyProfile(req, res, next) {
        let petCarerId = req.petCarer;

        let resBody = await petCarerServices.getSpecificPetCarer(petCarerId);

        return res.status(200).send(dataResponse("Your petCarer profile is successfully fetched", resBody))
    },

    async updateMyProfile(req, res, next) {
        let petCarerId = req.petCarer;

        let profileImage = req.file;

        let { firstName, lastName, locationLat, locationLng, locationName, dob, motivation, languageSpoken, biologicalGender } = req.body;
        let resBody = await petCarerServices.updateSpecificPetCarer(petCarerId, firstName, lastName, dob,
            locationLat, locationLng, locationName, profileImage, motivation, languageSpoken, biologicalGender);

        return res.status(200).send(dataResponse("Your Pet Owner Profile has been updated", resBody));
    }
}  

export default petCarerController; 