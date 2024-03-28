import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError, validateRequest } from "@mathaitickets/common";
import { User } from "../models/user";
import jwt from "jsonwebtoken";

const router = express.Router();

// all middleware's run in order

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("Creating a user...");

    const { email } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email in use");
    }

    const user = User.build(req.body);
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // Redefine session rather than adding to it to avoid TS issues
    req.session = {
      jwt: userJwt,
    };

    // Store it on session object

    res.status(201).send(user);
  }
);

export { router as signupRouter };
