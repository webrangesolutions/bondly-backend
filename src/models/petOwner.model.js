import mongoose from "mongoose"

const Schema = mongoose.Schema;

const PetOwnerSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: "User",
    unique: true
  },
  address: {
    type: String,
    required: true
  },
  emergencyNumber: {
    type: String,
    default: null
  },
  location: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  pets: {
    type: [
      {
        type: Schema.ObjectId,
        ref: "Pet"
      }
    ],
    default: []
  }
});

let PetOwner = mongoose.model('PetOwner', PetOwnerSchema);

export default PetOwner