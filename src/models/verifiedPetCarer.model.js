import mongoose from "mongoose";

const Schema = mongoose.Schema;

const VerifiedPetCarerSchema = new Schema({

    petCarer: {
        type: Schema.ObjectId,
        ref: "petCarer",
    },

    images: {
        type: [String]
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
        ref: "User",
        default: null
    }
}, {
    timestamps: true
});


VerifiedPetCarerSchema.pre('findOneAndUpdate', function (next) {
    const userId = this.getOptions().context.userId;
    if (userId) {
        this.set({ updatedBy: userId });
    }
    next();
});

let VerifiedPetCarer = mongoose.model('verifiedpetcarer', VerifiedPetCarerSchema);

export default VerifiedPetCarer;
