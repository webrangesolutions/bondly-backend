import mongoose from "mongoose"

const Schema = mongoose.Schema;

const FavouritePetCarerSchema = new Schema({
    petOwner: {
        type: Schema.ObjectId,
        ref: "PetOwner",
    },
    favouritePetCarer: [
        {
            petCarer: {
                type: Schema.ObjectId,
                ref: "PetCarer",
            }
        },
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
        ref: "User",
        default: null
    }
}, {
    timestamps: true
});

FavouritePetCarerSchema.pre('findOneAndUpdate', function (next) {
    const userId = this.getUpdate().updatedBy;
    if (userId) {
        this.set({ updatedBy: userId });
    }
    next();
});

let FavouritePetCarer = mongoose.model('FavouritePetCarer', FavouritePetCarerSchema);

export default FavouritePetCarer