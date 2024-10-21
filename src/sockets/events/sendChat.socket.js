import chatServices from "../../services/chat.services.js";
import { uploadFileToFirebase } from "../../services/storage.services.js";

export const sendChat = async (data, file) => {
  let fileUrl = null;

  if (file) {
    const filePath = `chat/${data.senderId}`; // Assuming 'data.senderId' exists
    const fileName = `${Date.now()}_${file.originalname}`;

    fileUrl = await uploadFileToFirebase(filePath, fileName, file);
  }

  await chatServices.createChat({
    sender: data.senderId,
    receiver: data.receiverId,
    messageType: data.messageType,
    textMessage: data?.textMessage || null,
    imageUrl: fileUrl || null,
    replyTo: data?.replyTo || null,
  });
};
