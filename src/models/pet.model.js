import mongoose from "mongoose"

const Schema = mongoose.Schema;

const PetSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: "User",
    // unique: true,
    // required: true
  },
  petOwner: { //If We need to show that Pet Carer also owns pets, then refer User Id here instead.
    type: Schema.ObjectId,
    ref: "PetOwner",
    // required: true
  },
  type: {
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

  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
  },
  physicalAttributes: {
    type: String,
    // required: true
  },
  dob: {
    type: Date,
    required: true
  },
  homeAddress: {
    type: String,
    // required: true
  },
  spayedOrCastrated: {
    type: Boolean,
    required: true,
    default: false
  },
  microchipNumber: {
    type: String,
    // required: true,
    // unique: true
    //it is not in the petCarer pets detail...
  },
  hobbies: {
    type: String,
    default: ""
  },
  favouriteActivities: {
    type: String,
    default: ""
  },
  fearsAndTriggers: {
    type: String,
    default: ""
  },
  clinicName: {
    type: String,
    // required: true
  },
  veterainDoctorName: {
    type: String,
    // required: true
  },
  clinicAddress: {
    type: String,
    // required: true
  },
  clinicPhoneNumber: {
    countryCode: {
      type: String,
      // required: true
    },
    number: {
      type: String,
      // required: true,
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
  petSize: {
    size: {
      type: String,
      // enum: ['Small', 'Medium', 'Large'], 
      required: false
    },
    weight: {
      type: String,
      required: false
    }
  },
  animalClass: {
    type: String,
    default: ""
  },
  aboutYourPet: {
    type: String,
    default: ""
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
  timestamps: true
});

PetSchema.pre('findOneAndUpdate', function (next) {
  const userId = this.getOptions().context.userId;
  if (userId) {
    this.set({ updatedBy: userId });
  }
  next();
});


let Pet = mongoose.model('Pet', PetSchema);

export default Pet