
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

        return res.status(200).send(dataResponse("Your Pet Carer Profile has been updated", resBody));
    },
    async getPetCarerRequests(req, res, next) {
        const resBody = await petCarerServices.getPetCarerRequests();
        return res.status(200).send(dataResponse("Pet Carer requests fetched successfully.", resBody));
    },
    async identityVerification(req, res, next) {
        let petCarerId = req.petCarer;
        let images = req.files['images'];
        const resBody = await petCarerServices.identityVerification(petCarerId, images);
        return res.status(200).send(dataResponse("Pet Carer Datails added.", resBody));
    },
    async getIdentityVerification(req, res, next) {
        let petCarerId = req.petCarer;
        const resBody = await petCarerServices.getIdentityVerification(petCarerId);
        return res.status(200).send(dataResponse("Pet Carer details get succesfully.", resBody));
    },
    async applyToOrder(req, res, next) {
        let petCarerId = req.petCarer;
        let { orderRequest, orderTo } = req.body;
        const resBody = await petCarerServices.applyToOrder(petCarerId, orderRequest, orderTo);
        return res.status(200).send(dataResponse("Pet owner apply to request successfully.", resBody));
    },
    async cancelOrderByPetCarer(req, res, next) {
        let petCarerId = req.petCarer;
        let { orderId, status } = req.body;
        const resBody = await petCarerServices.cancelOrderByPetCarer(orderId, status, petCarerId);
        return res.status(200).send(dataResponse("Pet owner cancel requests successfully.", resBody));
    },
    async startOrderByPetCarer(req, res, next) {
        let petCarerId = req.petCarer;
        let { orderId, status } = req.body;
        const resBody = await petCarerServices.startOrderByPetCarer(orderId, status, petCarerId);
        return res.status(200).send(dataResponse("Pet owner start order successfully.", resBody));
    },
    async completeOrderByPetCarer(req, res, next) {
        let petCarerId = req.petCarer;
        let { orderId, status } = req.body;
        const resBody = await petCarerServices.completeOrderByPetCarer(orderId, status, petCarerId);
        return res.status(200).send(dataResponse("Pet owner completed order successfully.", resBody));
    },
}

export default petCarerController; 