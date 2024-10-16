import mongoose from "mongoose";

const { Schema } = mongoose;

const VerifiedCredentialSchema = new Schema({
  email: {
    type: String,
    unique: true,
    sparse: true,
    match: [/.+@.+\..+/, "Please enter a valid email address"],
  },
  phone: {
    countryCode: {
      type: String,
    },
    number: {
      type: String,
      match: [/^\d+$/, "Please enter a valid phone number"],
    },
  },
  otp: {
    type: String,
  },
  verified: {
    type: Boolean,
    required: true,
    default: false,
  },
  expiresAt: {
    type: Date,
    required: true, // Make it required to ensure it's set at creation
  },
});

// Create a compound index to ensure unique phone numbers (countryCode + number)
VerifiedCredentialSchema.index(
  { "phone.countryCode": 1, "phone.number": 1 },
  { unique: true, sparse: true }
);
// Ensure the TTL index is created properly
VerifiedCredentialSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Pre-save hook removed since we will set expiresAt directly in the code

// Set expiration time (e.g., 10 minutes after creation)
VerifiedCredentialSchema.pre("validate", function (next) {
  // Set expiresAt to the current time + OTP_VALID_TIME (in minutes)
  const expirationTime = process.env.OTP_VALID_TIME * 60 * 1000; // Convert minutes to milliseconds
  this.expiresAt = Date.now() + expirationTime;
  next();
});

const VerifiedCredential = mongoose.model(
  "VerifiedCredential",
  VerifiedCredentialSchema
);

export default VerifiedCredential;
