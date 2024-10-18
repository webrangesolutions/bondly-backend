
import PetCarer from "../models/petCarer.model.js";
import User from "../models/user.model.js";
import petCarerRepository from "../repositories/petCarer.repositories.js";
import { uploadFileToFirebase } from "./storage.services.js";
import validateRequiredFields from "../utils/validationUtils.js";
import createHttpError from "http-errors";
import PetWalk from "../models/petWalk.model.js";
import PetSitting from "../models/petSitting.model.js";
import DropIn from "../models/petDropIn.model.js";
import VerifiedPetCarer from '../models/verifiedPetCarer.model.js'
import { addWaterMark } from "../utils/addWaterMark.js";
import Order from "../models/order.model.js";
const petCarerServices = {
    async getSpecificPetCarer(id) {
        let petCarer = await petCarerRepository.getSpecificPetCarer(id);

        return { petCarer }
    },
    async updateSpecificPetCarer(petCarerId, firstName, lastName, dob,
        location, profileImage, motivation, languageSpoken, biologicalGender) {

        // Getting Pet Carer and User
        let petCarer = await PetCarer.findById(petCarerId);
        let user = await User.findById(petCarer.user);
        // Check if the required fields are present
        const { valid, message, status } = validateRequiredFields({
            firstName,
            biologicalGender,
            lastName,
            dob,
            languageSpoken,
            motivation
        });

        if (!valid) {
            throw new createHttpError(status, message); // Throw error if fields are missing
        }

        // Updating User
        let profileImageUrl;
        if (profileImage) {
            profileImageUrl = await uploadFileToFirebase(`users/${user._id}`, "profileImage", profileImage);
            user.profileImageUrl = profileImageUrl;
        }

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (dob) user.dob = dob;

        // Updating Pet Carer
        if (location.lat) petCarer.location.lat = location.lat;
        if (location.lng) petCarer.location.lng = location.lng;
        if (location.name) petCarer.location.name = location.name;
        if (biologicalGender) petCarer.biologicalGender = biologicalGender;
        if (languageSpoken) petCarer.languageSpoken = Array.isArray(languageSpoken) ? languageSpoken : [languageSpoken];
        if (motivation) petCarer.motivation = motivation;
        petCarer.updatedBy = user._id;
        await petCarer.save();
        await user.save();

        return {
            petCarer: {
                ...user.toObject(),
                ...petCarer.toObject()
            }
        };
    },
    async getPetCarerRequests() {
        const petWalkRequests = await PetWalk.find();

        const petSittingRequests = await PetSitting.find();

        const dropInRequests = await DropIn.find();

        const allRequests = [
            ...petWalkRequests,
            ...petSittingRequests,
            ...dropInRequests
        ];

        return {
            allRequests
        };
    },
    async identityVerification(petCarerId, images) {

        const imageUploadPromises = images.map(async (picture, index) => {
            return uploadFileToFirebase(`verificationImages/${petCarerId}`, `IdCard_${index}`, picture);
        });


        const imagesPictureUrls = await Promise.all(imageUploadPromises);

        let verificationDetail = new VerifiedPetCarer({
            petCarer: petCarerId,
            images: imagesPictureUrls,
            createdBy: petCarerId
        })
        let verify = await verificationDetail.save();
        return {
            verify
        }
    },
    async getIdentityVerification(petCarerId) {


        let verifiedDetails = await VerifiedPetCarer.find({ petCarer: petCarerId })
        return {
            verifiedDetails
        }
    },
    async applyToOrder(petCarerId, orderRequest, orderTo) {
        let order = new Order({
            orderTo: orderTo,
            orderRequest,
            orderBy: petCarerId,
            createdBy: petCarerId
        })
        let orderSave = await order.save();
        return {
            orderSave
        }
    },
    async cancelOrderByPetCarer(orderId, status, petCarerId) {
        const orderCancel = await Order.findByIdAndUpdate(
            orderId,
            {
                $set: {
                    status: status,
                    'updatedBy.petCarer': petCarerId
                }
            },
            { new: true }
        );
        return {
            orderCancel
        };
    },
    async startOrderByPetCarer(orderId, status, petCarerId) {
        const orderStart = await Order.findByIdAndUpdate(
            orderId,
            {
                $set: {
                    status: status,
                    'updatedBy.petCarer': petCarerId
                }
            },
            { new: true }
        );
        return {
            orderStart
        };
    },
    async completeOrderByPetCarer(orderId, status, petCarerId) {
        const orderStart = await Order.findByIdAndUpdate(
            orderId,
            {
                $set: {
                    status: status,
                    'updatedBy.petCarer': petCarerId
                }
            },
            { new: true }
        );
        return {
            orderStart
        };
    }

}

export default petCarerServices;