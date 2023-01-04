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

let id = "0123";
let origin_username = "TestUser";
let origin_password = "1234";
let origin_email = "test@cc.cc";
let origin_phone = "1234567890";

let new_username = "EditedUser";
let new_password = "5678";
let new_email = "edit@cc.cc";
let new_phone = "987654321";

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
  test("register a new user", async () => {
    return testSession
      .post("/users/register")
      .type("form")
      .send({
        username: origin_username,
        password: origin_password,
        email: origin_email,
        id: id,
        phone: origin_phone,
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
      .send({ id: id, password: origin_password, _csrf: csrfToken })
      .end(function (err, res) {
        assert.equal(res.status, 302);
        done();
      });
  });

  test("check if logined", async () => {
    return testSession.get("/users/logined").expect(200);
  });

  let passwordEditing = false;

  test("edit profile without pwd", async () => {
    await testSession
      .put("/profile/" + id)
      .type("form")
      .send({
        _csrf: csrfToken,
        data: {
          username: new_username,
          email: new_email,
          phone: new_phone,
          passwordEditing: passwordEditing,
          oldPassword: "",
          newPassword: "",
        },
      })
      .expect(200);

    testSession.get("/profile").end(function (err, res) {
      const $ = cheerio.load(res.text);
      //console.log("id: " + getInputValue(res.text, "id"));
      let afterEditUsername = getInputValue(res.text, "username");
      let afterEditEmail = getInputValue(res.text, "email");
      let afterEditPhone = getInputValue(res.text, "phone");
      expect(afterEditUsername).toBe(new_username);
      expect(afterEditEmail).toBe(new_email);
      expect(afterEditPhone).toBe(new_phone);
    });
  });

  test("login/register page should be redireted", async () => {
    return testSession
      .get("/users/session")
      .expect(302)
      .expect("Location", "/home");
  });
});
