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

        let profileImage = req.files['images'] || [];

        let { firstName, lastName, locationLat, locationLng, dob, address, emergencyNumber } = req.body;

        let resBody = await petOwnerServices.updateSpecificPetOwner(petOwnerId, firstName, lastName, dob, address,
            locationLat, locationLng, emergencyNumber, profileImage);

        return res.status(200).send(dataResponse("Your Pet Owner Profile has been updated", resBody));
    },

    async addPetWalkRequest(req, res, next) {

        let requestedBy = req.petOwner;
        const {
            petId,
            requestType,
            pickUpLocation,
            timeSlots,
            confirmationDate,
            genderPreference,
            specialInstruction,
            houseAccessInstructions,
            preferedPetWalker,
            orderPrice,
            favouriteOnes
        } = req.body;

        const createdBy = requestedBy;

        if (!genderPreference || !timeSlots || timeSlots.length === 0) {
            throw new createHttpError.BadRequest("Preferred sitting location and at least one time slot are required.");
        }
        let resBody = await petOwnerServices.addPetWalkRequest(
            petId,
            requestedBy,
            requestType,
            pickUpLocation,
            timeSlots,
            confirmationDate,
            genderPreference,
            specialInstruction,
            houseAccessInstructions,
            preferedPetWalker,
            orderPrice,
            createdBy,
            favouriteOnes
        );

        return res.status(201).send(dataResponse("Dog walk request has been created.", resBody));

    },
    async addPetSittingRequest(req, res, next) {

        let requestedBy = req.petOwner;
        const {
            petId,
            requestType,
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
            favouriteOnes
        } = req.body;
        const createdBy = requestedBy;
        if (!preferedSittingLocation || !timeSlots || timeSlots.length === 0) {
            throw new createHttpError.BadRequest("Preferred sitting location and at least one time slot are required.");
        }
        let resBody = await petOwnerServices.addPetSittingRequest(
            petId,
            requestedBy,
            requestType,
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
            createdBy,
            favouriteOnes
        );

        return res.status(201).send(dataResponse("Pet sitting request has been created.", resBody));

    },
    async addDropInRequest(req, res, next) {

        let requestedBy = req.petOwner;
        const {
            petId,
            requestType,
            pickUpLocation,
            timeSlots,
            confirmationDate,
            genderPreference,
            feedingInstruction,
            medicalInstruction,
            houseAccessInstructions,
            preferedDogWalker,
            orderPrice,
            favouriteOnes
        } = req.body;
        if (!genderPreference || !timeSlots || timeSlots.length === 0) {
            throw new createHttpError.BadRequest("Preferred sitting location and at least one time slot are required.");
        }
        let resBody = await petOwnerServices.addDropInRequest(
            petId,
            requestedBy,
            requestType,
            pickUpLocation,
            timeSlots,
            confirmationDate,
            genderPreference,
            feedingInstruction,
            medicalInstruction,
            houseAccessInstructions,
            preferedDogWalker,
            orderPrice,
            favouriteOnes
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
    async acceptOrderByPetOwner(req, res, next) {
        let petOwnerId = req.petOwner;
        let { orderId, status } = req.body;
        const resBody = await petOwnerServices.acceptOrderByPetOwner(orderId, status, petOwnerId);
        return res.status(200).send(dataResponse("Pet owner accepted request successfully.", resBody));
    },
    async meetAndGreet(req, res, next) {

        let petOwnerId = req.petOwner;
        console.log(req.params)
        let {
            id
        } = req.params;
        let petCarerId = id;
        let {
            date,
            time,
            confirmationDate,
            preferedSittingLocation,
            orderPrice
        } = req.body;
        if (!petOwnerId)
            throw new createHttpError.BadRequest("No petOwner found.");
        let resBody = await petOwnerServices.meetAndGreet(
            petOwnerId,
            petCarerId,
            date,
            time,
            confirmationDate,
            preferedSittingLocation,
            orderPrice
        );

        return res.status(201).send(dataResponse("Meet And Greet Request Sent to PetCarer.", resBody));
    },
    async goodFeedbackAndRating(req, res, next) {

        let petOwnerId = req.petOwner;
        let {
            orderId,
            petCarerId,
            rating,
            message
        } = req.body;
        if (!petOwnerId)
            throw new createHttpError.BadRequest("No petOwner found.");
        let resBody = await petOwnerServices.goodFeedbackAndRating(
            orderId,
            petOwnerId,
            petCarerId,
            rating,
            message

        );

        return res.status(201).send(dataResponse("Good FeedBack Send Succesfully.", resBody));
    },
    async badFeedbackAndRating(req, res, next) {

        let petOwnerId = req.petOwner;
        let images = req.files['images'] || [];
        let {
            orderId,
            petCarerId,
            rating,
            specialIssues,
            detailedFeedback
        } = req.body;
        if (!petOwnerId)
            throw new createHttpError.BadRequest("No petOwner found.");
        let resBody = await petOwnerServices.badFeedbackAndRating(
            orderId,
            petOwnerId,
            petCarerId,
            rating,
            specialIssues,
            detailedFeedback,
            images
        );

        return res.status(201).send(dataResponse("Bad FeedBack Send Succesfully.", resBody));
    },
    async removeAsFavourite(req, res, next) {
        let petOwnerId = req.petOwner;
        let {
            petCarerId,
            specialReasons,
            message
        } = req.body;
        if (!petOwnerId)
            throw new createHttpError.BadRequest("No petOwner found.");
        let resBody = await petOwnerServices.removeAsFavourite(
            petOwnerId,
            petCarerId,
            specialReasons,
            message
        );

        return res.status(201).send(dataResponse("Remove As Favourite FeedBack Send Succesfully.", resBody));
    },
    async badMeetAndGreetFeedback(req, res, next) {

        let petOwnerId = req.petOwner;
        let {
            meetAndGreetId,
            petCarerId,
            negativeFeedback,
            detailedNegativeFeedback
        } = req.body;
        if (!petOwnerId)
            throw new createHttpError.BadRequest("No petOwner found.");
        let resBody = await petOwnerServices.badMeetAndGreetFeedback(
            meetAndGreetId,
            petOwnerId,
            petCarerId,
            negativeFeedback,
            detailedNegativeFeedback
        );

        return res.status(201).send(dataResponse("Bad Meet And Greet FeedBack Send Succesfully.", resBody));
    },
    async goodMeetAndGreetFeedback(req, res, next) {

        let petOwnerId = req.petOwner;
        let {
            meetAndGreetId,
            petCarerId,
            positiveFeedback,
            detailedPositiveFeedback
        } = req.body;
        if (!petOwnerId)
            throw new createHttpError.BadRequest("No petOwner found.");
        let resBody = await petOwnerServices.goodMeetAndGreetFeedback(
            meetAndGreetId,
            petOwnerId,
            petCarerId,
            positiveFeedback,
            detailedPositiveFeedback
        );

        return res.status(201).send(dataResponse("Bad Meet And Greet FeedBack Send Succesfully.", resBody));
    },
}

export default petOwnerController;