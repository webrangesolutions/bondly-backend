import mongoose from "mongoose";

const Schema = mongoose.Schema;
const meetAndGreetFeedback = new Schema({
    meetAndGreet: {
        type: Schema.ObjectId,
        ref: "meetAndGreet"
    },
    petOwner: {
        type: Schema.ObjectId,
        ref: "PetOwner"
    },
    petCarer: {
        type: Schema.ObjectId,
        ref: "PetCarer"
    },
    petCarerFeedback: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: Schema.ObjectId,
        ref: "User",
        default: null
    },
    updatedBy: {
        type: Schema.ObjectId,
        ref: "PetOwner",
        default: null
    }
}, {
    timestamps: true
}
);

meetAndGreetFeedback.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
    this.set({ 'updatedBy': update.updatedBy });
    next();
});

const MeetAndGreet = mongoose.model('PetCarerMeetAndGreetFeedback', meetAndGreetFeedback);

export default MeetAndGreet;