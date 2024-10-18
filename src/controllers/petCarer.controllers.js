
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

        let { firstName, lastName, location, dob, motivation, languageSpoken, biologicalGender } = req.body;
        let resBody = await petCarerServices.updateSpecificPetCarer(petCarerId, firstName, lastName, dob,
            location, profileImage, motivation, languageSpoken, biologicalGender);

        return res.status(200).send(dataResponse("Your Pet Owner Profile has been updated", resBody));
    },
    async getPetCarerRequests(req, res, next) {
        const resBody = await petCarerServices.getPetCarerRequests();
        return res.status(200).send(dataResponse("Pet owner requests fetched successfully.", resBody));
    },
    async identityVerification(req, res, next) {
        let petCarerId = req.petCarer;
        let images = req.files['images'];
        const resBody = await petCarerServices.identityVerification(petCarerId, images);
        return res.status(200).send(dataResponse("Pet owner requests fetched successfully.", resBody));
    },
    async getIdentityVerification(req, res, next) {
        let petCarerId = req.petCarer;
        const resBody = await petCarerServices.getIdentityVerification(petCarerId);
        return res.status(200).send(dataResponse("Pet owner requests fetched successfully.", resBody));
    },
}

export default petCarerController; 