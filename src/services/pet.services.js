import createHttpError from "http-errors";
import Pet from "../models/pet.model.js";
import PetOwner from "../models/petOwner.model.js";
import { uploadFileToFirebase } from "./storage.services.js";
import validateRequiredFields from "../utils/validationUtils.js";
import PetCarer from "../models/petCarer.model.js";

const petServices = {
    async addPet(petOwnerId, image, type, name, breed, physicalAttributes, dob,
        homeAddress, spayedOrCastrated, microchipNumber, hobbies, favouriteActivities, fearsAndTriggers,
        clinicName, veterainDoctorName, clinicAddress, clinicCountryCode, clinicPhoneNumber, medicalHistory, specialNotes, size) {

        let petOwner = await PetOwner.findById(petOwnerId);

        if (!petOwner)
            throw new createHttpError.NotFound("Pet Owner not found");

        let pet = new Pet({
            petOwner: petOwnerId,
            clinicPhoneNumber: {
                countryCode: clinicCountryCode,
                number: clinicPhoneNumber
            },
            type, name, breed, physicalAttributes, dob, homeAddress,
            spayedOrCastrated, microchipNumber, hobbies, favouriteActivities, fearsAndTriggers, clinicName,
            veterainDoctorName, clinicAddress, medicalHistory, specialNotes, size
        })

        pet.imageUrl = await uploadFileToFirebase(`pets/${pet._id}`, "image", image);

        petOwner.pets.push(pet._id);

        await pet.save();
        await petOwner.save();

        return { pet };
    },

    async addPetByPetCarer(
        petCarerId, homeType, floor, elevatorAvailable, homePictures, locationLat, locationLng, locationName, motivation, transportationMethod, dropIns, dayPetSitting, overnightPetSitting, meetAndGreet, havePets, image, petsData
    ) {

        // Find the existing Pet Carer
        let petCarer = await PetCarer.findById(petCarerId);

        if (!petCarer) {
            throw new createHttpError.NotFound("Pet Carer not found");
        }

        // Ensure at least two home pictures
        if (homePictures.length < 2) {
            throw new createHttpError.BadRequest("At least two home pictures are required");
        }

        // Prepare file upload promises for home pictures
        const homePictureUploadPromises = homePictures.map((picture, index) => {
            return uploadFileToFirebase(`homePictures/${petCarerId}`, `homePic_${index}`, picture);
        });

        // Upload all home pictures concurrently using Promise.all()
        const homePictureUrls = await Promise.all(homePictureUploadPromises);

        // Update Pet Carer details
        petCarer.homeType = homeType || petCarer.homeType;
        petCarer.floor = floor || petCarer.floor;
        petCarer.elevatorAvailable = elevatorAvailable || petCarer.elevatorAvailable;
        petCarer.location = {
            lat: locationLat || petCarer.location.lat,
            lng: locationLng || petCarer.location.lng,
            name: locationName || petCarer.location.name,
        };
        petCarer.motivation = motivation || petCarer.motivation;
        petCarer.transportationMethod = transportationMethod || petCarer.transportationMethod;
        petCarer.pricingDetail = {
            dropIns: dropIns || petCarer.pricingDetail.dropIns,
            dayPetSitting: dayPetSitting || petCarer.pricingDetail.dayPetSitting,
            overnightPetSitting: overnightPetSitting || petCarer.pricingDetail.overnightPetSitting,
            meetAndGreet: meetAndGreet || petCarer.pricingDetail.meetAndGreet,
        };
        petCarer.havePets = havePets;
        petCarer.homePictures = homePictureUrls;
        if (havePets) {

            const petPromises = petsData.map(async (petData) => {
                let { type, name, gender, spayedOrCastrated, dob, hobbies, fearsAndTriggers, animalClass, aboutYourPet } = petData;
                    
                const pet = new Pet({
                    user: petCarerId,
                    type,
                    name,
                    gender,
                    spayedOrCastrated,
                    dob,
                    hobbies,
                    fearsAndTriggers,
                    animalClass,
                    aboutYourPet
                });

                // Upload pet profile image
                pet.imageUrl = await uploadFileToFirebase(`pets/${pet._id}`, "profile", image);
                await pet.save();
                return pet._id;
            });

            const petIds = await Promise.all(petPromises);
            petCarer.pets.push(...petIds);
        }

        await petCarer.save();

        return { petCarer, pets: petCarer.pets };
    }



}

export default petServices;