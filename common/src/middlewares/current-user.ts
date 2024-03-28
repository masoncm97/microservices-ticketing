import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload | null;
    }
  }
}
export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // If there is no session or no jwt in the session, then there is no current user
  if (!req.session?.jwt) {
    return next();
  }

  // If there is a jwt in the session, then we will try to verify it
  try {
    // Verify the token
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    // Set the current user to the payload
    req.currentUser = payload;
  } catch (err) {
    // If the token is invalid, then we will set the current user to null
    req.currentUser = null;
  }

  // Call next to continue on to the next middleware
  next();
};
