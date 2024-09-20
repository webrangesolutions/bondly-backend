import filesManagementServices from "../services/filesManagement.services.js";
import { dataResponse } from "../utils/responses.js";

const fileManagementController = {
    async uploadSignupVideo(req, res, next){
        let resBody = await filesManagementServices.uploadSignupVideo(req.file);

        return res.status(200).send(dataResponse("File has been uploaded", resBody))
    },

    async getSignupVideoLink(req, res, next){
        let resBody = await filesManagementServices.getSignUpVideoLink();

        return res.redirect(resBody.fileUrl);
    }
}

export default fileManagementController;