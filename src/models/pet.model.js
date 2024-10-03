import mongoose from "mongoose"

const Schema = mongoose.Schema;

const PetSchema = new Schema({
  petOwner:{ //If We need to show that Pet Carer also owns pets, then refer User Id here instead.
    type: Schema.ObjectId,
    ref: "PetOwner",
    required: true
  },
  type:{
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  breed: {
    type: String,
    required: true
  },
  physicalAttributes: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  homeAddress:{
    type: String,
    required: true
  },
  spayedOrCastrated:{
    type: Boolean,
    required: true,
    default: false
  },
  microchipNumber: {
    type: String,
    required: true,
    unique: true
  },
  hobbies: {
    type: String,
    default: ""
  },
  favouriteActivities:{
    type: String,
    default: ""
  },
  fearsAndTriggers: {
    type: String,
    default: ""
  },
  clinicName:{
    type: String,
    required: true
  },
  veterainDoctorName: {
    type: String,
    required: true
  },
  clinicAddress:{
    type: String,
    required: true
  },
  clinicPhoneNumber:{
    countryCode: {
        type: String,
        required: true
    },
        number: {
        type: String,
        required: true,
        match: [/^\d+$/, 'Please enter a valid phone number']
    }
  },
  medicalHistory: {
    type: String,
    default: ""
  },
  specialNotes: {
    type: String,
    default: ""
  },
  size: {
    type: String,
    required: true
  }
});

let Pet = mongoose.model('Pet', PetSchema);

export default Pet