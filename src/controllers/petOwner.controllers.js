import petOwnerServices from "../services/petOwner.services.js";
import { dataResponse } from "../utils/responses.js";

const petOwnerController = {
    async getMyProfile(req, res, next) {
        let petOwnerId = req.petOwner;

        let resBody = await petOwnerServices.getSpecificPetOwner(petOwnerId);

        return res.status(200).send(dataResponse("Your petowner profile is successfully fetched", resBody))
    },

    async updateMyProfile(req, res, next) {
        let petOwnerId = req.petOwner;

        let profileImage = req.file;

        let { firstName, lastName, locationLat, locationLng, dob, address, emergencyNumber } = req.body;

        let resBody = await petOwnerServices.updateSpecificPetOwner(petOwnerId, firstName, lastName, dob, address,
            locationLat, locationLng, emergencyNumber, profileImage);

        return res.status(200).send(dataResponse("Your Pet Owner Profile has been updated", resBody));
    },

    async addPetWalkRequest(req, res, next) {

        let requestedBy = req.petOwner;
        const {
            pickUpLocation,
            timeSlots,
            confirmationDate,
            genderPreference,
            specialInstruction,
            houseAccessInstructions,
            preferedPetWalker,
            orderPrice
        } = req.body;

        const createdBy = requestedBy;

        if (!genderPreference || !timeSlots || timeSlots.length === 0) {
            throw new createHttpError.BadRequest("Preferred sitting location and at least one time slot are required.");
        }
        let resBody = await petOwnerServices.addPetWalkRequest(
            requestedBy,
            pickUpLocation,
            timeSlots,
            confirmationDate,
            genderPreference,
            specialInstruction,
            houseAccessInstructions,
            preferedPetWalker,
            orderPrice,
            createdBy
        );

        return res.status(201).send(dataResponse("Dog walk request has been created.", resBody));

    },
    async addPetSittingRequest(req, res, next) {

        let requestedBy = req.petOwner;
        const {
            confirmationDate,
            confirmationTime,
            preferedSittingLocation,
            walkPerDay,
            mealsPerDay,
            medicalInstructions,
            timeSlots,
            medicalInsRequired,
            specialNotes,
            preferedDogSitter,
            orderPrice
        } = req.body;
        const createdBy = requestedBy;
        if (!preferedSittingLocation || !timeSlots || timeSlots.length === 0) {
            throw new createHttpError.BadRequest("Preferred sitting location and at least one time slot are required.");
        }
        let resBody = await petOwnerServices.addPetSittingRequest(
            requestedBy,
            confirmationDate,
            confirmationTime,
            preferedSittingLocation,
            walkPerDay,
            mealsPerDay,
            medicalInstructions,
            timeSlots,
            medicalInsRequired,
            specialNotes,
            preferedDogSitter,
            orderPrice,
            createdBy
        );

        return res.status(201).send(dataResponse("Pet sitting request has been created.", resBody));

    },
    async addDropInRequest(req, res, next) {

        let requestedBy = req.petOwner;
        const {
            pickUpLocation,
            timeSlots,
            confirmationDate,
            genderPreference,
            feedingInstruction,
            medicalInstruction,
            houseAccessInstructions,
            preferedDogWalker,
            orderPrice
        } = req.body;
        if (!genderPreference || !timeSlots || timeSlots.length === 0) {
            throw new createHttpError.BadRequest("Preferred sitting location and at least one time slot are required.");
        }
        let resBody = await petOwnerServices.addDropInRequest(
            requestedBy,
            pickUpLocation,
            timeSlots,
            confirmationDate,
            genderPreference,
            feedingInstruction,
            medicalInstruction,
            houseAccessInstructions,
            preferedDogWalker,
            orderPrice
        );

        return res.status(201).send(dataResponse("Pet drop-in request has been created.", resBody));
    },
    async getPetOwnerRequests(req, res, next) {
        let requestedBy = req.petOwner;
        const resBody = await petOwnerServices.getPetOwnerRequests(requestedBy);
        return res.status(200).send(dataResponse("Pet owner requests fetched successfully.", resBody));
    },
    async addFavouritePetCarer(req, res, next) {

        let petOwnerId = req.petOwner;
        const {
            favouritePetCarer
        } = req.body;
        if (!favouritePetCarer || favouritePetCarer.length === 0) {
            throw new createHttpError.BadRequest("No Favourite Pet Carer.");
        }
        let resBody = await petOwnerServices.addFavouritePetCarer(
            petOwnerId, favouritePetCarer
        );

        return res.status(201).send(dataResponse("Pet drop-in request has been created.", resBody));
    },
    async getFavouritePetCarer(req, res, next) {

        let petOwnerId = req.petOwner;
        if (!petOwnerId)
            throw new createHttpError.BadRequest("No petOwner found.");
        let resBody = await petOwnerServices.getFavouritePetCarer(
            petOwnerId
        );

        return res.status(201).send(dataResponse("Pet drop-in request has been created.", resBody));
    },
    async updateFavouritePetCarer(req, res, next) {

        let petOwnerId = req.petOwner;
        let {
            favouritePetCarerId
        } = req.body;
        if (!petOwnerId)
            throw new createHttpError.BadRequest("No petOwner found.");
        let resBody = await petOwnerServices.updateFavouritePetCarer(
            petOwnerId,
            favouritePetCarerId
        );

        return res.status(201).send(dataResponse("Pet drop-in request has been created.", resBody));
    },
    async deleteFavouritePetCarer(req, res, next) {

        let petOwnerId = req.petOwner;
        let {
            petCarerId
        } = req.body;
        if (!petOwnerId)
            throw new createHttpError.BadRequest("No petOwner found.");
        let resBody = await petOwnerServices.deleteFavouritePetCarer(
            petOwnerId,
            petCarerId
        );

        return res.status(201).send(dataResponse("Pet drop-in request has been created.", resBody));
    },

}

export default petOwnerController;