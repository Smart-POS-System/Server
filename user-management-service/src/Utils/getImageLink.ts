import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import multer from "multer";
import { Request } from "express";
import { storage } from "./firebase";

const giveCurrentDateTime = () => {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return date + " " + time;
};

export const upload = multer({ storage: multer.memoryStorage() }).single(
  "image"
);

export const getImageLink = (req: Request): Promise<string | null> => {
  return new Promise<string | null>(async (resolve, reject) => {
    try {
      if (!req.file) {
        resolve(null);
        return;
      }

      const dateTime = giveCurrentDateTime();
      const sanitizedFileName = req.file.originalname.replace(
        /[^a-zA-Z0-9.]/g,
        "_"
      );
      const storageRef = ref(
        storage,
        `Employee/${sanitizedFileName + "_" + dateTime}`
      );

      const metadata = {
        contentType: req.file.mimetype,
      };

      const uploadTask = uploadBytesResumable(
        storageRef,
        req.file.buffer,
        metadata
      );

      uploadTask.on(
        "state_changed",
        () => {}, // Optional progress tracking
        (error) => {
          console.error("Upload failed:", error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            console.error("Failed to get download URL:", error);
            reject(error);
          }
        }
      );
    } catch (error) {
      console.error("Unexpected error during upload:", error);
      reject(error);
    }
  });
};
