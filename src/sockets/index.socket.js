import petCarerServices from "../services/petCarer.services.js";
import { sendChat } from "./events/sendChat.socket.js";
import jwt from "jsonwebtoken";

let sockets = [];
const onlineUsers = new Set();
const userSocketIDs = new Map();

const initSocket = (io) => {
  io.use((socket, next) => {
    let token = socket.handshake.headers.token;
    if (!token) {
      return next(new Error("Authentication token missing"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_AUTHENTICATION_SECRET);
      socket.user = decoded;
      return next();
    } catch (error) {
      return next(new Error("Invalid authentication token"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.user;
    let petCarer = socket.user?.petCarer;
    if (petCarer) {
      petCarerServices.getMeetAndGreet(petCarer).then((meetAndGreetData) => {
        socket.emit("getMeetAndGreet", meetAndGreetData); // Send data to the connected user
      }).catch((error) => {
        console.error("Error fetching meet and greet:", error);
      });
    }

    if (user && user.user) {
      console.log(`User connected: ${user.user}`);
      userSocketIDs.set(user.user.toString(), socket.id);
      onlineUsers.add(user.user.toString());
      // console.log(onlineUsers)
      io.emit("ONLINE_USERS", Array.from(onlineUsers));
    }


    socket.on("sendChat", (data, file) => sendChat(data, file));
    socket.on("disconnect", () => {
      if (user && user.id) {
        console.log(`User disconnected: ${user.id}`);
        onlineUsers.delete(user.id.toString());
        userSocketIDs.delete(user.id.toString());
        io.emit("ONLINE_USERS", Array.from(onlineUsers));
      }
    });
  });
};
export const getSockets = (users = []) => {
  const sockets = users.map((user) => userSocketIDs.get(user.toString()));
  return sockets;
};

export default initSocket;
