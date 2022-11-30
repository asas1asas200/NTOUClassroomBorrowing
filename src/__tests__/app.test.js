const request = require("supertest");
const app = require("../app");

describe("index route", () => {
  test("home page", async () => {
    return request(app).get("/home").expect(200);
  });
  test("redirect to login", async () => {
    return request(app)
      .get("/users/logined")
      .expect(302)
      .expect("Location", "/users/session");
  });
  test("forbidden page", async () => {
    return request(app).get("/users/admin_only").expect(403);
  });
});
