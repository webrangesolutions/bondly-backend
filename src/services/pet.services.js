import createHttpError from "http-errors";
import Pet from "../models/pet.model.js";
import PetOwner from "../models/petOwner.model.js";
import { uploadFileToFirebase } from "./storage.services.js";
import validateRequiredFields from "../utils/validationUtils.js";
import PetCarer from "../models/petCarer.model.js";

const petServices = {
    async addPet(petOwnerId, image, type, name, breed, physicalAttributes, dob,
        homeAddress, spayedOrCastrated, microchipNumber, hobbies, favouriteActivities, fearsAndTriggers,
        clinicName, veterainDoctorName, clinicAddress, clinicCountryCode, clinicPhoneNumber, medicalHistory, specialNotes, size, gender) {

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
            veterainDoctorName, clinicAddress, medicalHistory, specialNotes, size, gender
        })

        pet.imageUrl = await uploadFileToFirebase(`pets/${pet._id}`, "image", image);

        petOwner.pets.push(pet._id);

        await pet.save();
        await petOwner.save();

        return { pet };
    },

    async addPetByPetCarer(
        petCarerId, homeType, floor, elevatorAvailable, homePictures, location, motivation, transportationMethod, dropIns, dayPetSitting, overnightPetSitting, meetAndGreet, havePets, images, petsData
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
            lat: location.lat || petCarer.location.lat,
            lng: location.lng || petCarer.location.lng,
            name: location.name || petCarer.location.name,
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

            const petPromises = petsData.map(async (petData, index) => {
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
                pet.imageUrl = await uploadFileToFirebase(`pets/${pet._id}`, "profile", images[index]);
                pet.createdBy = petCarerId;
                await pet.save();
                return pet._id;
            });

            const petIds = await Promise.all(petPromises);
            // petCarer.pets.push(...petIds);
        }
        petCarer.updatedBy = petCarerId;
        await petCarer.save();

        return { petCarer, pets: petCarer.pets };
    }
    ,
    async getPetsByPetOwnerId(userId) {
        let allPets = await Pet.find({ "petOwner": userId });
        return { allPets };
    },
    async updatePetByPetOwner(
        petOwnerId, petId, image, type, name, breed, physicalAttributes, dob,
        homeAddress, spayedOrCastrated, microchipNumber, hobbies, favouriteActivities, fearsAndTriggers,
        clinicName, veterainDoctorName, clinicAddress, clinicCountryCode, clinicPhoneNumber,
        medicalHistory, specialNotes, size
    ) {
        // Find the Pet Owner
        let petOwner = await PetOwner.findById(petOwnerId);

        if (!petOwner) {
            throw new createHttpError.NotFound("Pet Owner not found");
        }

        // Find the existing Pet
        let pet = await Pet.findById(petId);

        if (!pet) {
            throw new createHttpError.NotFound("Pet not found");
        }

        // Update pet details
        pet.type = type || pet.type;
        pet.name = name || pet.name;
        pet.breed = breed || pet.breed;
        pet.physicalAttributes = physicalAttributes || pet.physicalAttributes;
        pet.dob = dob || pet.dob;
        pet.homeAddress = homeAddress || pet.homeAddress;
        pet.spayedOrCastrated = spayedOrCastrated || pet.spayedOrCastrated;
        pet.microchipNumber = microchipNumber || pet.microchipNumber;
        pet.hobbies = hobbies || pet.hobbies;
        pet.favouriteActivities = favouriteActivities || pet.favouriteActivities;
        pet.fearsAndTriggers = fearsAndTriggers || pet.fearsAndTriggers;
        pet.clinicName = clinicName || pet.clinicName;
        pet.veterainDoctorName = veterainDoctorName || pet.veterainDoctorName;
        pet.clinicAddress = clinicAddress || pet.clinicAddress;
        pet.medicalHistory = medicalHistory || pet.medicalHistory;
        pet.specialNotes = specialNotes || pet.specialNotes;
        pet.size = size || pet.size;

        // Update clinicPhoneNumber with countryCode and number
        pet.clinicPhoneNumber = {
            countryCode: clinicCountryCode || pet.clinicPhoneNumber?.countryCode,
            number: clinicPhoneNumber || pet.clinicPhoneNumber?.number
        };

        // If an image is provided, upload the image and update the imageUrl
        if (image) {
            pet.imageUrl = await uploadFileToFirebase(`pets/${pet._id}`, "image", image);
        }

        // Save the updated pet details
        await pet.save();

        // Ensure the pet is in the petOwner's list of pets
        if (!petOwner.pets.includes(pet._id)) {
            petOwner.pets.push(pet._id);
        }

        // Save the pet owner
        await petOwner.save();

        return { pet };
    }

}

export default petServices;