import chatServices from "../services/chat.services.js";
import { dataResponse } from "../utils/responses.js";

const chatController = {
    async getAllChat(req, res, next) {

        let { senderId, recieverId } = req.params;
        if (!senderId || !recieverId) {
            return res.status(400).send({
                success: false,
                message: "Sender and receiver IDs are required."
            });
        }
        const resBody = await chatServices.getAllChat(senderId, recieverId);
        return res.status(200).json({
            success: true,
            message: "Chat retrieved successfully.",
            data: resBody,
        });
    },
}

export default chatController;