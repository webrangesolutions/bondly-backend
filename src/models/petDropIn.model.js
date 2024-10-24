import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PetDropIn = new Schema({
    petId: {
        type: Schema.ObjectId,
        ref: "Pet"
    },
    requestName: {
        type: String,
        default: "Drop Ins"
    }, requestType: {
        type: String,
        enum: ['normal', 'medium', 'high']
    },
    requestedBy: {
        type: Schema.ObjectId,
        ref: "PetOwner",
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
    },
    feedingInstruction: {
        type: String
    }
    ,
    medicalInstruction: {
        type: String
    }
    , houseAccessInstructions: {
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
    }, status: {
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
        ref: "User",
        default: null
    }
}, {
    timestamps: true // createdAt and updatedAt will be handled automatically by Mongoose
});

// Middleware to set updatedBy before updating
PetDropIn.pre('findOneAndUpdate', function (next) {
    const userId = this.getUpdate().updatedBy; // Retrieve userId from context
    if (userId) {
        this.set({ updatedBy: userId }); // Set the updatedBy field
    }
    next();
});

let DropIn = mongoose.model('PetDropIn', PetDropIn);

export default DropIn;
