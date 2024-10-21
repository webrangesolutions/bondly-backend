import Chat from "../models/Chat.model.js";

const chatServices = {
  async createChat(data) {
    const chat = new Chat(data);
    await chat.save();
  },
};

export default chatServices;
