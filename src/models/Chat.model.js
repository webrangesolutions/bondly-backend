import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const chatSchema = new Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messageType: {
      type: String,
      enum: ["text", "image"],
      required: true,
    },
    textMessage: {
      type: String,
      required: function () {
        return this.messageType === "text";
      },
    },
    imageUrl: {
      type: String,
      required: function () {
        return this.messageType === "image";
      },
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readTimestamp: {
      type: Date,
    },
    deliveredTimestamp: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Chat = model("Chat", chatSchema);

export default Chat;
