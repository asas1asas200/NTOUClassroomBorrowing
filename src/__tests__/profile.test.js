const mongoose = require("mongoose");
const session = require("supertest-session");
const cheerio = require("cheerio");
const assert = require("assert");
const User = require("../models/user.js");
const app = require("../app");

var csrfToken;

function extractCSRFToken(html) {
  const $ = cheerio.load(html);
  return $("input[name=_csrf]").val();
}

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/test");
  await mongoose.connection.db.dropDatabase();
  await User.createRoot();
});

beforeEach(function (done) {
  testSession = session(app);
  testSession.get("/users/session").end(function (err, res) {
    assert.equal(res.status, 200);
    csrfToken = extractCSRFToken(res.text);
    done();
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("login and register", () => {
  test("login as not exist user", async () => {
    return testSession
      .post("/users/login")
      .type("form")
      .send({ id: "0123", password: "1234", _csrf: csrfToken })
      .expect(302)
      .expect("Location", "/users/session");
  });

  test("login as default root", async () => {
    return testSession
      .post("/users/login")
      .type("form")
      .send({ id: "root", password: "root", _csrf: csrfToken })
      .expect(302)
      .expect("Location", "/home");
  });

  test("register a new user", async () => {
    return testSession
      .post("/users/register")
      .type("form")
      .send({
        username: "TestUser",
        password: "1234",
        email: "test@cc.cc",
        id: "0123",
        phone: "1234567890",
        _csrf: csrfToken,
      })
      .expect(302)
      .expect("Location", "/users/session");
  });
});
function getInputValue(html, id) {
  const $ = cheerio.load(html);
  let value = $("#" + id).val();
  return value;
}

describe("login as new user", () => {
  beforeEach(function (done) {
    testSession
      .post("/users/login")
      .type("form")
      .send({ id: "0123", password: "1234", _csrf: csrfToken })
      .end(function (err, res) {
        assert.equal(res.status, 302);
        done();
      });
  });

  test("logined page", async () => {
    return testSession.get("/users/logined").expect(200);
  });

  test("edit phone", async () => {
    id = "0123";
    testSession
      .put("/profile/" + id)
      .type("form")
      .send({
        username: "TestUser",
        email: "test@cc.cc",
        id: "0123",
        phone: "1234567890000000",
        _csrf: csrfToken,
      })
      .end(function (err, res) {
        console.log(res);
      });

    testSession.get("/profile").end(function (err, res) {
      const $ = cheerio.load(res.text);
      console.log("id: " + getInputValue(res.text, "id"));

      console.log("username: " + getInputValue(res.text, "username"));

      console.log("email: " + getInputValue(res.text, "email"));

      console.log("phone: " + getInputValue(res.text, "phone"));
    });
  });

  test("login/register page should be redireted", async () => {
    return testSession
      .get("/users/session")
      .expect(302)
      .expect("Location", "/home");
  });
});
