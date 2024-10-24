import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ContactUsSchema = new Schema({
    petCarerId: {
        type: Schema.ObjectId,
        ref: "PetCarer"
    },
    message: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: Schema.ObjectId,
        ref: "PetCarer",
        default: null
    },
    updatedBy: {

        type: Schema.ObjectId,
        ref: "PetCarer",
        default: null

    }
}, {
    timestamps: true // createdAt and updatedAt will be handled automatically by Mongoose
});

ContactUsSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate(); // Retrieve the update object

    // Check if petCarerId or petOwnerId is provided in the update
    if (update.updatedBy) {
        this.set({ 'updatedBy': update.updatedBy });
    }

    next();
});


let ContactUs = mongoose.model('ContactUs', ContactUsSchema);

export default ContactUs;
