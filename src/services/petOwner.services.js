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
    }
}

export default petOwnerServices;