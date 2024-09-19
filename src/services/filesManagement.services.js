// controllers/uploadController.js
import { bucket } from "../configs/firebase.config";

// Function to upload file to Firebase Storage
export const uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded.' });
    }

    try {
        const blob = bucket.file(req.file.originalname);
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: req.file.mimetype,
            },
        });

        blobStream.on('error', (err) => {
            return res.status(500).send({ message: err.message });
        });

        blobStream.on('finish', async () => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            return res.status(200).send({ message: 'File uploaded successfully', url: publicUrl });
        });

        blobStream.end(req.file.buffer);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};