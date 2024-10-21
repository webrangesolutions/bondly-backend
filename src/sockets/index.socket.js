import { sendChat } from "./events/sendChat.socket.js";

let sockets = [];

const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected with socket ID:", socket.id);

    socket.on("sendChat", (data, file) => sendChat(data, file));

    socket.on("disconnect", () => {
      console.log("User disconnected with socket ID:", socket.id);
    });
  });
};

export default initSocket;
