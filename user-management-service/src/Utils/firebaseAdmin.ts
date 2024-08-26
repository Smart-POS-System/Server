// import admin, { ServiceAccount } from "firebase-admin";
// import dotenv from "dotenv";
// import path from "path";

// dotenv.config({ path: path.resolve(__dirname, "../../config.env") });

// import serviceAccount from "./Firebase/smart-pos-system-dd859-firebase-adminsdk-5shdo-ac2aa1ae73.json";

// const serviceAccountConfig: ServiceAccount = serviceAccount as ServiceAccount;

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccountConfig),
//     storageBucket: process.env.FIREBASE_STORAGE_BUCKET as string,
//   });
// }

// const bucket = admin.storage().bucket();

// export { bucket };
