import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ratingAndFeedback = new Schema({
    petOwner: {
        type: Schema.ObjectId,
        ref: "PetOwner"
    },
    petCarer: {
        type: Schema.ObjectId,
        ref: "PetCarer"
    },
    orderId: {
        type: Schema.ObjectId,
        ref: "Order"
    },
    rating: {
        type: Number,
        default: 5
    },
    message: {
        type: String
    },
    specialIssues: [
        {
            type: String,
            enum: [
                "pet safety",
                "punctuality",
                "communication",
                "cleaniness",
                "other"
            ],
        }
    ],
    detailedFeedback: {
        type: String,
    },
    images: [
        {
            type: String
        }
    ],
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

ratingAndFeedback.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
    this.set({ 'updatedBy': update.updatedBy });
    next();
});

const RatingFeedback = mongoose.model('RatingAndFeedBack', ratingAndFeedback);

export default RatingFeedback;