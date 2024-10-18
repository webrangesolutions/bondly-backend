import mongoose from "mongoose";

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    orderRequest: {
        petWalk: {
            type: Schema.ObjectId,
            ref: "PetWalk",
            default: null
        },
        petSitting: {
            type: Schema.ObjectId,
            ref: "PetSitting",
            default: null
        },
        dropIn: {
            type: Schema.ObjectId,
            ref: "DropIn",
            default: null
        }
    },
    orderBy: {
        type: Schema.ObjectId,
        ref: 'PetCarer'
    },
    orderTo: {
        type: Schema.ObjectId,
        ref: 'PetOwner'
    },
    status: {
        type: String,
        enum: ['pending', 'accept', 'start', 'complete', 'cancel'],
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

OrderSchema.pre('findOneAndUpdate', function (next) {
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


let Order = mongoose.model('Order', OrderSchema);

export default Order;
