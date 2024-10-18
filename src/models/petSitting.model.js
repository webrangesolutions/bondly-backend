import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PetSittingSchema = new Schema({
    requestName: {
        type: String,
        default: "Pet Sitting"
    },
    requestType: {
        type: String,
        enum: ['normal', 'medium', 'high']
    },
    requestedBy: {
        type: Schema.ObjectId,
        ref: "User",
    },
    confirmationDate: {
        type: Date
    },
    confirmationTime: {
        type: String
    },
    preferedSittingLocation: {
        type: String,
        enum: ['Owner Home', 'Sitter Home', 'both']
    },
    walkPerDay: {
        type: String
    }
    ,
    mealsPerDay: {
        type: String
    }
    , medicalInstructions: {
        type: String
    }, timeSlots: [
        {
            date: {
                type: Date,
                required: true
            },
            houseKey: {
                type: String,
                enum: ['key Pickup', 'key exchange']
            },
            overNight: {
                type: Boolean
            },
            timeArrival: Date,
            timeDeparture: Date
        },
    ],
    medicalInsRequired: {
        type: String
    },
    specialNotes: {
        type: String
    },
    preferedDogSitter: {
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
                },
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
PetSittingSchema.pre('findOneAndUpdate', function (next) {
    const userId = this.getOptions().context.userId; // Retrieve userId from context
    if (userId) {
        this.set({ updatedBy: userId }); // Set the updatedBy field
    }
    next();
});

let PetSitting = mongoose.model('PetSitting', PetSittingSchema);

export default PetSitting;
