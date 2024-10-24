import createHttpError from "http-errors";
import Pet from "../models/pet.model.js";
import DropIn from "../models/petDropIn.model.js";
import PetOwner from "../models/petOwner.model.js";
import PetWalk from "../models/petWalk.model.js";
import User from "../models/user.model.js";
import petOwnerRepository from "../repositories/petOwner.repositories.js";
import { uploadFileToFirebase } from "./storage.services.js";
import PetSitting from "../models/petSitting.model.js";
import FavouritePetCarer from "../models/favouritePetCarer.model.js";
import Order from "../models/order.model.js";
import meetAndGreet from "../models/meetAndGreets.model.js";
import RatingFeedback from "../models/ratingFeeback.model.js";
import RemoveFavourite from "../models/removeFavourite.model.js";
import MeetAndGreet from "../models/meetAndGreetFeedback.model.js";

const petOwnerServices = {
    async getSpecificPetOwner(id) {
        let petOwner = await petOwnerRepository.getSpecificPetOwner(id);

        return { petOwner }
    },

    async updateSpecificPetOwner(petOwnerId, firstName, lastName, dob, address,
        locationLat, locationLng, emergencyNumber, profileImage) {

        let petOwner = await PetOwner.findById(petOwnerId);

        let user = await User.findById(petOwner.user);

        let profileImageUrl;

        if (profileImage) {
            profileImageUrl = await uploadFileToFirebase(`/users/${user._id}/`, "profileImage", profileImage);
            user.profileImageUrl = profileImageUrl;
        }

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (dob) user.dob = dob;

        if (address) petOwner.address = address;
        if (locationLat) petOwner.location.lat = locationLat;
        if (locationLng) petOwner.location.lng = locationLng;
        if (emergencyNumber) petOwner.emergencyNumber = emergencyNumber;

        await petOwner.save();
        await user.save();

        return {
            petOwner: {
                ...user.toObject(),
                ...petOwner.toObject()
            }
        }
    }
    , async addPetWalkRequest(
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
        favouriteOnes) {

        const newPetWalk = new PetWalk({
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
            isActive: true,
            favouriteOnes
        });

        const savedPetWalk = await newPetWalk.save();

        return savedPetWalk;
    }, async addPetSittingRequest(
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
    ) {
        const newPetSitting = new PetSitting({
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
            isActive: true,
            favouriteOnes
        });

        const savedPetSitting = await newPetSitting.save();

        return savedPetSitting;
    },
    async addDropInRequest(
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
    ) {

        const newDropIn = new DropIn({
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
            createdBy: requestedBy,
            isActive: true,
            favouriteOnes
        });

        const savedDropIn = await newDropIn.save();
        return savedDropIn;
    },
    async getPetOwnerRequests(requestedBy) {
        const petWalkRequests = await PetWalk.find({ requestedBy: requestedBy });
        const petSittingRequests = await PetSitting.find({ requestedBy: requestedBy });
        const dropInRequests = await DropIn.find({ requestedBy: requestedBy });
        const allRequests = [
            ...petWalkRequests,
            ...petSittingRequests,
            ...dropInRequests
        ];

        return {
            allRequests
        };
    },
    async addFavouritePetCarer(petOwnerId, favouritePetCarer) {
        const newFavouritePetCarer = new FavouritePetCarer(
            {
                petOwner: petOwnerId,
                favouritePetCarer,
                createdBy: petOwnerId
            }
        )

        let savedFavouritePetCarer = await newFavouritePetCarer.save();
        return {
            savedFavouritePetCarer
        };
    },
    async getFavouritePetCarer(petOwnerId) {
        let favouritePetCarer = await FavouritePetCarer.find({ petOwner: petOwnerId });
        return {
            favouritePetCarer
        };
    },
    async updateFavouritePetCarer(petOwnerId, favouritePetCarerId) {
        const updatedFavouritePetCarer = await FavouritePetCarer.findOneAndUpdate(
            { petOwner: petOwnerId },
            {
                $set: {
                    favouritePetCarer: [{ petCarer: favouritePetCarerId }],
                    updatedBy: petOwnerId
                }
            },
            { new: true }
        );

        return {
            updatedFavouritePetCarer
        };
    },
    async deleteFavouritePetCarer(petOwnerId, petCarerId) {
        const updatedFavouritePetCarer = await FavouritePetCarer.findOneAndUpdate(
            { petOwner: petOwnerId },
            {
                $pull: {
                    favouritePetCarer: { petCarer: petCarerId }
                },
                updatedBy: petOwnerId
            },
            { new: true, runValidators: true }
        );

        return {
            updatedFavouritePetCarer
        };
    },
    async acceptOrderByPetOwner(orderId, status, petOwnerId) {
        let order = await Order.findById(orderId)
        let request;
        if (order.orderRequest.petWalk) {
            request = await PetWalk.findByIdAndUpdate(order.orderRequest.petWalk, {
                $set: {
                    status: 'confirm',
                    updatedBy: petOwnerId
                }
            }, { new: true })
        }
        if (order.orderRequest.petSitting) {
            request = await PetSitting.findByIdAndUpdate(order.orderRequest.petSitting, {
                $set: {
                    status: 'confirm',
                    updatedBy: petOwnerId
                }
            }, { new: true })
        }
        if (order.orderRequest.dropIn) {
            request = await DropIn.findByIdAndUpdate(order.orderRequest.dropIn, {
                $set: {
                    status: 'confirm',
                    updatedBy: petOwnerId
                }
            }, { new: true })
        }
        const acceptOrder = await Order.findByIdAndUpdate(
            orderId,
            {
                $set: {
                    status: status,
                    'updatedBy.petOwner': petOwnerId
                }
            },
            { new: true }
        );
        return {
            acceptOrder,
            request
        };
    },
    async meetAndGreet(petOwnerId,
        petCarerId,
        date,
        time,
        confirmationDate,
        preferedSittingLocation,
        orderPrice) {
        console.log(petCarerId)
        let newMeetAndGreet = new meetAndGreet({
            petCarerId: petCarerId,
            petOwnerId: petOwnerId,
            date: date,
            time: time,
            confirmationDate: confirmationDate,
            preferedSittingLocation: preferedSittingLocation,
            orderPrice: orderPrice
            , createdBy: petOwnerId
        });
        let meetAndGreetSave = await newMeetAndGreet.save();
        return {
            meetAndGreetSave
        };
    },
    async goodFeedbackAndRating(
        orderId,
        petOwnerId,
        petCarerId,
        rating,
        message) {

        let newFeedback = new RatingFeedback({
            orderId: orderId,
            petOwner: petOwnerId,
            petCarer: petCarerId,
            message: message,
            rating: rating,
            createdBy: petOwnerId
        });
        let feedbackSave = await newFeedback.save();
        return {
            feedbackSave
        };
    },
    async badFeedbackAndRating(
        orderId,
        petOwnerId,
        petCarerId,
        rating,
        specialIssues,
        detailedFeedback,
        images
    ) {
        const imageUploadPromises = images.map(async (picture, index) => {
            return uploadFileToFirebase(`badFeedback/${orderId}`, `badFeedback_${index}`, picture);
        });
        const imagesPictureUrls = await Promise.all(imageUploadPromises);
        let newFeedback = new RatingFeedback({
            orderId: orderId,
            petOwner: petOwnerId,
            petCarer: petCarerId,
            rating: rating,
            specialIssues: specialIssues,
            detailedFeedback: detailedFeedback,
            images: imagesPictureUrls,
            createdBy: petOwnerId
        });
        let feedbackSave = await newFeedback.save();
        return {
            feedbackSave
        };
    },
    async removeAsFavourite(
        petOwnerId,
        petCarerId,
        specialReasons,
        message
    ) {
        let removeFeedback = new RemoveFavourite({
            petOwner: petOwnerId,
            petCarer: petCarerId,
            specialReasons: specialReasons,
            message: message,
            createdBy: petOwnerId
        });
        let removeFeedbackSave = await removeFeedback.save();
        return {
            removeFeedbackSave
        };
    },
    async badMeetAndGreetFeedback(
        meetAndGreetId,
        petOwnerId,
        petCarerId,
        negativeFeedback,
        detailedNegativeFeedback
    ) {

        let newFeedback = new MeetAndGreet({
            meetAndGreet: meetAndGreetId,
            petOwner: petOwnerId,
            petCarer: petCarerId,
            negativeFeedback: negativeFeedback,
            detailedNegativeFeedback: detailedNegativeFeedback,
            createdBy: petOwnerId
        });
        let feedbackSave = await newFeedback.save();
        return {
            feedbackSave
        };
    },
    async goodMeetAndGreetFeedback(
        meetAndGreetId,
        petOwnerId,
        petCarerId,
        positiveFeedback,
        detailedPositiveFeedback
    ) {

        let newFeedback = new MeetAndGreet({
            meetAndGreet: meetAndGreetId,
            petOwner: petOwnerId,
            petCarer: petCarerId,
            positiveFeedback: positiveFeedback,
            detailedPositiveFeedback: detailedPositiveFeedback,
            createdBy: petOwnerId
        });
        let feedbackSave = await newFeedback.save();
        return {
            feedbackSave
        };
    },
}

export default petOwnerServices;