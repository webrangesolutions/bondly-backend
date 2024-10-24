import mongoose from "mongoose";

const Schema = mongoose.Schema;
const removeFavoriteSchema = new Schema({
    petOwner: {
        type: Schema.ObjectId,
        ref: "PetOwner"
    },
    petCarer: {
        type: Schema.ObjectId,
        ref: "PetCarer"
    },
    specialReasons: [
        {
            type: String,
            enum: [
                "availability issue",
                "quality of work",
                "poor communication",
                "found better match",
                "price concerns",
                "other"
            ],
        }
    ],
    message: {
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

removeFavoriteSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
    this.set({ 'updatedBy': update.updatedBy });
    next();
});

const RemoveFavourite = mongoose.model('RemoveFavourite', removeFavoriteSchema);

export default RemoveFavourite;