import createHttpError from "http-errors";
import petOwnerServices from "../services/petOwner.services.js";
import { dataResponse } from "../utils/responses.js";
import petServices from "../services/pet.services.js";

const petController = {
    async addPetByPetOwner(req, res, next) {
        let petOwnerId = req.petOwner;

        let image = req.file;

        let { type, name, breed, physicalAttributes, dob, homeAddress,
            spayedOrCastrated, microchipNumber, hobbies, favouriteActivities,
            fearsAndTriggers, clinicName, veterainDoctorName, clinicAddress, clinicCountryCode,
            clinicPhoneNumber, medicalHistory, specialNotes, size } = req.body;

        if (!image)
            throw new createHttpError.BadRequest("Image not found");

        let resBody = await petServices.addPet(petOwnerId, image, type, name, breed, physicalAttributes, dob,
            homeAddress, spayedOrCastrated, microchipNumber, hobbies, favouriteActivities, fearsAndTriggers,
            clinicName, veterainDoctorName, clinicAddress, clinicCountryCode, clinicPhoneNumber, medicalHistory, specialNotes, size);

        return res.status(201).send(dataResponse("Pet has been added.", resBody));

    },
    // Controller function
    async addPetByPetCarer(req, res, next) {
        try {
            let petCarerId = req.petCarer;

            // Retrieve files
            let image = req.files['image'] ? req.files['image'][0] : null;
            // console.log(image,"images"); 
            let homePictures = req.files['homePictures'] || [];

            if (homePictures.length < 2) {
                throw new createHttpError.BadRequest("At least two home pictures are required");
            }
            let petsData = [];
            let petIndex = 0;
            while (true) {
                let petData = {
                    name: req.body[`petsData[${petIndex}].name`],
                    type: req.body[`petsData[${petIndex}].type`],
                    gender: req.body[`petsData[${petIndex}].gender`],
                    spayedOrCastrated: req.body[`petsData[${petIndex}].spayedOrCastrated`],
                    dob: req.body[`petsData[${petIndex}].dob`],
                    hobbies: req.body[`petsData[${petIndex}].hobbies`],
                    fearsAndTriggers: req.body[`petsData[${petIndex}].fearsAndTriggers`],

                };
                if (petData.type === 'Others') {
                    petData.animalClass = req.body[`petsData[${petIndex}].animalClass`];
                    petData.aboutYourPet = req.body[`petsData[${petIndex}].aboutYourPet`];
                }
                if (!petData.name) break;
                petsData.push(petData);
                petIndex++;
            }

            let {
                homeType, floor, elevatorAvailable, locationLat, locationLng, locationName, motivation, transportationMethod,
                dropIns, dayPetSitting, overnightPetSitting, meetAndGreet, havePets 
            } = req.body;
            let resBody = await petServices.addPetByPetCarer(
                petCarerId, homeType, floor, elevatorAvailable, homePictures, locationLat, locationLng, locationName, motivation, transportationMethod, dropIns, dayPetSitting, overnightPetSitting, meetAndGreet, havePets, image, petsData
            );

            return res.status(201).send(dataResponse("Pet(s) have been added.", resBody));

        } catch (error) {
            next(error); 
        }
    }
    ,
    async updateMyProfile(req, res, next) {
        let petOwnerId = req.petOwner;

        let profileImage = req.file;

        let { firstName, lastName, locationLat, locationLng, dob, address, emergencyNumber } = req.body;

        let resBody = await petOwnerServices.updateSpecificPetOwner(petOwnerId, firstName, lastName, dob, address,
            locationLat, locationLng, emergencyNumber, profileImage);

        return res.status(200).send(dataResponse("Your Pet Owner Profile has been updated", resBody));
    }
}

export default petController;