import mongoose from "mongoose";

const Schema = mongoose.Schema;

const meetAndGreetSchema = new Schema({
    petCarerId: {
        type: Schema.ObjectId,
        ref: 'PetCarer'
    },
    petOwnerId: {
        type: Schema.ObjectId,
        ref: 'PetOwner'
    },
    date: {
        type: Date,
    },
    time: {
        type: Date
    },
    preferedSittingLocation: {
        type: String,
        enum: ['myhome', 'sitter home']
    },
    confirmationDate: {
        type: Date
    },
    orderPrice: {
        type: Number
    },
    status: {
        type: String,
        enum: ['pending', 'accept', 'reject', 'confirm'],
        default: 'pending'
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
        petCarer: {
            type: Schema.ObjectId,
            ref: "PetCarer",
            default: null
        },
        petOwner: {
            type: Schema.ObjectId,
            ref: "PetOwner",
            default: null
        }
    }
}, {
    timestamps: true // createdAt and updatedAt will be handled automatically by Mongoose
});

meetAndGreetSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate(); // Retrieve the update object

    // Check if petCarerId or petOwnerId is provided in the update
    if (update.updatedBy?.petCarer) {
        this.set({ 'updatedBy.petCarer': update.updatedBy.petCarer });
    }
    if (update.updatedBy?.petOwner) {
        this.set({ 'updatedBy.petOwner': update.updatedBy.petOwner });
    }

    next();
});


let meetAndGreet = mongoose.model('meetAndGreet', meetAndGreetSchema);

export default meetAndGreet;
