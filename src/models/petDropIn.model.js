import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PetDropIn = new Schema({
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
            houseKey: {
                type: String,
                enum: ['key Pickup', 'key exchange']
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
    const userId = this.getOptions().context.userId; // Retrieve userId from context
    if (userId) {
        this.set({ updatedBy: userId }); // Set the updatedBy field
    }
    next();
});

let DropIn = mongoose.model('PetDropIn', PetDropIn);

export default DropIn;