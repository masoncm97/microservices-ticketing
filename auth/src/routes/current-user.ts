import express from "express";
import { currentUser } from "@mathaitickets/common";

const router = express.Router();

router.get("/api/users/currentuser", currentUser, (req, res) => {
  console.log("1");
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
