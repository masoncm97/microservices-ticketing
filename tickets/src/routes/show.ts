import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { NotFoundError, BadRequestError } from "@mathaitickets/common";

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!objectIdRegex.test(req.params.id)) {
    throw new BadRequestError("Invalid ticket ID format");
  }

  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw new NotFoundError();
  }

  res.send(ticket);
});

export { router as showTicketRouter };
