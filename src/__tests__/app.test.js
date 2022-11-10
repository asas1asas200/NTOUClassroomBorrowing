const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");

beforeEach(async () => {
  await mongoose.connect("mongodb://localhost:27017/test");
});

afterEach(async () => {
  await mongoose.connection.close();
});

describe("index route", () => {
  test("home page", async () => {
    return request(app).get("/home").expect(200);
  });
  test("redircet to login", async () => {
    return request(app)
      .get("/users/logined")
      .expect(302)
      .expect("Location", "/users/session");
  });
  test("forbidden page", async () => {
    return request(app).get("/users/admin_only").expect(403);
  });
});
