import request from "supertest";
import { app } from "../../app";

it("returns a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "asdfjsdfkl",
      password: "password",
    })
    .expect(400);
});

it("returns a 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "p",
    })
    .expect(400);
});

it("returns a 400 with missing email and password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com" })
    .expect(400);

  await request(app)
    .post("/api/users/signup")
    .send({ password: "password" })
    .expect(400);
});

it("disallows duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password" })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password" })
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password" })
    .expect(201);

  // This won't work becsuse the cookie session settings are set to be 'secure: true normally' which will only work on https connection
  expect(response.get("Set-Cookie")).toBeDefined();
});
