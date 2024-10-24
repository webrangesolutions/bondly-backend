import Chat from "../models/Chat.model.js";

const chatServices = {
  async createChat(data) {
    const chat = new Chat(data);
    await chat.save();
  },
  async getAllChat(senderId, receiverId) {
    try {
      const chatMessages = await Chat.find({
        $or: [
          { sender: senderId, receiver: receiverId },
          { sender: receiverId, receiver: senderId }
        ]
      })
        .sort({ createdAt: 1 })
        .populate('sender', 'name')
        .populate('receiver', 'name')
        .exec();

      return chatMessages;
    } catch (error) {
      throw new Error(`Error retrieving chat messages: ${error.message}`);
    }
  }
};

export default chatServices;
