import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";

import { verifyToken } from "../services/authServices";

// /**
//  * Decodes a Base64 encoded string.
//  * @param base64String - The Base64 encoded string.
//  * @returns The decoded string or null if decoding fails.
//  */
const decodeBase64 = (base64String: string): string | null => {
  try {
    const decoded = Buffer.from(base64String, "base64").toString("utf-8");
    return decoded;
  } catch (error) {
    console.error("Error decoding Base64 string:", error);
    return null; // Return null if there's an error
  }
};

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;
    let session: string | null;

    if (req.cookies.session) {
      session = decodeBase64(req.cookies.session);

      if (session) {
        try {
          const sessionData = JSON.parse(session); // Parse the decoded session to JSON
          token = sessionData.jwt; // Extract the JWT from the session
        } catch (error) {
          return next(new AppError("Invalid session format.", 400)); // Handle parsing errors
        }
      }
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError("You are not logged in! Please log in to get access.", 401)
      );
    }

    const jwtSecret = process.env.JWT_SECRET as string;

    try {
      const decoded: any = await verifyToken(token, jwtSecret);

      // Attach decoded JWT payload to request object for further use
      (req as any).user = decoded;

      next();
    } catch (err) {
      return next(new AppError("Invalid token or token expired.", 401));
    }
  }
);
