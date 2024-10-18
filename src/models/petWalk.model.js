import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PetWalkSchema = new Schema({
    requestName: {
        type: String,
        default: "Dog Walk"
    }, requestType: {
        type: String,
        enum: ['normal', 'medium', 'high']
    },
    requestedBy: {
        type: Schema.ObjectId,
        ref: "User",
    },
    pickUpLocation: {
        type: {
            lat: Number,
            lng: Number,
            name: String
        },
        required: true
    },
    timeSlots: [
        {
            date: {
                type: Date,
                required: true
            },
            timeArrival: Date,
            timeDeparture: Date
        },
    ],
    confirmationDate: {
        type: Date
    },
    genderPreference: {
        type: String,
        enum: ['Male', 'Female', 'Others']
    }
    , specialInstruction: {
        type: String
    }, houseAccessInstructions: {
        type: String
    },
    preferedDogWalker: {
        type: [
            {
                type: Schema.ObjectId,
                ref: "PetCarer"
            }
        ]
    },
    orderPrice: {
        type: Number
    },
    status: {
        type: String,
        enum: ['confirm', 'pending'],
        default: 'pending'
    },
    favouriteOnes: {
        type: [
            {
                petCarer: {
                    type: Schema.ObjectId,
                    ref: "PetCarer"
                }
            }
        ]
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
});


PetWalkSchema.pre('findOneAndUpdate', function (next) {
    const userId = this.getUpdate().updatedBy;
    if (userId) {
        this.set({ updatedBy: userId });
    }
    next();
});

let PetWalk = mongoose.model('PetWalk', PetWalkSchema);

export default PetWalk;
