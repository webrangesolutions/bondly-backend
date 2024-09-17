import petOwnerServices from "../services/petOwner.services.js";
import { dataResponse } from "../utils/responses.js";

const petOwnerController = {
    async getMyProfile(req, res, next){
        let petOwnerId = req.petOwner;

        let resBody = await petOwnerServices.getSpecificPetOwner(petOwnerId);

        return res.status(200).send(dataResponse("Your petowner profile is successfully fetched", resBody))
    }
}

export default petOwnerController;