import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
it("returns a 400 if the input is not in Mongo objectID format", async () => {
  // Must use valid objectID format when querying mongo or else
  // it will error: valid format is 24-character hexadecimal string
  const response = await request(app)
    .get("/api/tickets/non-existent-ticket")
    .send()
    .expect(400);
});

it("returns a 404 if the ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  const response = await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(404);
});

it("returns the ticket if the ticket is found", async () => {
  const title = "concert";
  const price = 20;

  // Tests creation as well- pros and cons to this
  // Alternative is to create the ticket directly in mongo
  // rather than using a post request to our api
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: title, price: price })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
});
