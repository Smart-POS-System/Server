import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import multer from "multer";
import { Request } from "express";
//import { bucket } from "./firebaseAdmin";
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

export const getImageLink = (req: Request) => {
  return new Promise<string | null>((resolve, reject) => {
    if (!req.file) {
      resolve(null);
      return;
    }

    const dateTime = giveCurrentDateTime();
    const storageRef = ref(
      storage,
      `Employee/${req.file.originalname + " " + dateTime}`
    );

    const metadata = {
      contentType: req.file.mimetype,
    };

    uploadBytesResumable(storageRef, req.file.buffer, metadata)
      .then(async (snapshot) => {
        try {
          const downloadURL = await getDownloadURL(snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          reject(error);
        }
      })
      .catch(reject);
  });
};

// Import your Firebase Admin bucket instance

/*const storage = multer.memoryStorage();
export const upload = multer({ storage }).single("image");

export const getImageLink = async (req: Request) => {
  if (!req.file) {
    return null;
  }

  try {
    const { originalname, buffer, mimetype } = req.file;
    const blob = bucket.file(`${originalname}`);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: mimetype,
      },
    });

    blobStream.on("error", (err) => {
      return null;
    });

    blobStream.on("finish", async () => {
      const fileURL = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURIComponent(originalname)}?alt=media`;
      return fileURL;
    });

    blobStream.end(buffer);
  } catch (error) {
    return null;
  }
};*/

/* 
Firebase rules for storage
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}

service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
*/
