import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PetCarerSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: "User",
        unique: true,
    },
    biologicalGender: {
        type: String,
        enum: ['Male', 'Female'],
    },
    location: {
        lat: {
            type: Number,
        },
        lng: {
            type: Number,
        },
        name: {
            type: String,
        }
    },
    motivation: {
        type: String,
    },
    languageSpoken: {
        type: [String],
    },
    homeType: {
        type: String,
        enum: ['Apartment', 'House'],
    },
    floor: {
        type: String,
        enum: ['Ground', '1st Floor', '2nd Floor', '3rd Floor and Above'],
    },
    elevatorAvailable: {
        type: Boolean,
        default: false
    },
    homePictures: {
        type: [String], // Store URLs of pictures
    },
    transportationMethod: {
        type: String,
        enum: ['Car', 'Public Transport', 'Bike'],
    },
    pricingDetail: {
        dropIns: {
            type: Number,
        },
        dayPetSitting: {
            type: Number,
        },
        overnightPetSitting: {
            type: Number,
        },
        meetAndGreet: {
            type: Number,
        }
    },
    havePets: {
        type: Boolean,
        default: false
    },
    points: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    },
    averageResponseTime: {
        type: Number,
        default: 0
    },
    isVarified: {
        type: Boolean,
        default: false
    },
    // pets: {
    //     type: [
    //         {
    //             type: Schema.ObjectId,
    //             ref: "Pet"
    //         }
    //     ],
    //     default: []
    // },

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

PetCarerSchema.pre('findOneAndUpdate', function (next) {
    const userId = this.getOptions().context.userId;
    if (userId) {
        this.set({ updatedBy: userId });
    }
    next();
});

let PetCarer = mongoose.model('PetCarer', PetCarerSchema);

export default PetCarer;
