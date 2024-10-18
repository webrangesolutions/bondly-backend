// middlewares/uploadMiddleware.js
import multer from "multer";

// Set up multer to store files temporarily in the 'uploads' directory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// For multiple files: array and single combined
const multipleUploads = upload.fields([
    { name: "images", maxCount: 999 },
    { name: "homePictures", maxCount: 999 },
]);

export { upload, multipleUploads }