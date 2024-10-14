import { uploadFileToFirebase } from "./storage.services.js";

const filesManagementServices = {
  async uploadSignupVideo(file) {
    let fileUrl = await uploadFileToFirebase(
      "cover/videos",
      "signupVideo",
      file
    );

    return { fileUrl };
  },

  async getSignUpVideoLink() {
    let fileUrl = `https://storage.googleapis.com/${process.env.FIREBASE_PROJECT_ID}.appspot.com/cover/videos/signupVideo.mp4`;

    return { fileUrl };
  },
};

export default filesManagementServices;
