import mongoose from "mongoose";

const Schema = mongoose.Schema;
const petCarerFeedback = new Schema({
    pet: {
        type: Schema.ObjectId
        , ref: "Pet"
    },
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
    message: {
        type: String
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

petCarerFeedback.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
    this.set({ 'updatedBy': update.updatedBy });
    next();
});

const RatingFeedback = mongoose.model('PetCarerFeedback', petCarerFeedback);

export default RatingFeedback;