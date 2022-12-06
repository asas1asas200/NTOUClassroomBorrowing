const mongoose = require("mongoose");
const session = require("supertest-session");
const cheerio = require("cheerio");
const assert = require("assert");
const User = require("../models/user.js");
const Building = require("../models/building.js")
const Classroom = require("../models/classroom.js")
const Floor = require("../models/floor.js")
const app = require("../app");

var csrfToken;

function extractCSRFToken(html) {
  const $ = cheerio.load(html);
  return $("input[name=_csrf]").val();
}

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/test");
  await mongoose.connection.db.dropDatabase();
  User.createRoot();
  Building.createRoot();
  Classroom.createRoot();
  Floor.createRoot();
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

describe("Create floor", () => {
  test("login as default root", async () => {
    return testSession
      .post("/users/login")
      .type("form")
      .send({ id: "root", password: "root", _csrf: csrfToken })
      .post("/building")
      .type("form")
      .send({data:{name:"TestBuilding"},_csrf: csrfToken})     
      .expect(302)
      .expect("Location", "/home");
  });

  test("logined page", async () => {
    return testSession.get("/users/logined").expect(200);
  });

  test("admin only page", async () => {
    return testSession.get("/users/admin_only").expect(403);
  });

  test("login/register page should be redireted", async () => {
    return testSession
      .get("/users/session")
      .expect(302)
      .expect("Location", "/home");
  });
});