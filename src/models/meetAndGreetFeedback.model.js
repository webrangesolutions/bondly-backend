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
    detailedPositiveFeedback: {
        type: String
    },
    positiveFeedback: [
        {
            type: String,
            enum: [
                "communication",
                "punctual",
                "friendly",
                "professional",
                "other"
            ],
        }
    ],
    negativeFeedback: [
        {
            type: String,
            enum: [
                "poor communication",
                "unprofessional conduct",
                "not a good match",
                "no specific reasons",
                "good fit but chose another",
                "urgent alarm"
            ],
        }
    ],
    detailedNegativeFeedback: {
        type: String,
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

const MeetAndGreet = mongoose.model('MeetAndGreetFeedback', meetAndGreetFeedback);

export default MeetAndGreet;