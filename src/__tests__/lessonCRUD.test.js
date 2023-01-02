const mongoose = require("mongoose");
const session = require("supertest-session");
const cheerio = require("cheerio");
const assert = require("assert");
const User = require("../models/user.js");
const app = require("../app");

var csrfToken;
var Lessonid;

function extractCSRFToken(html) {
  const $ = cheerio.load(html);
  return $("input[name=_csrf]").val();
}

function extractLessonid(html) {
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

beforeEach(function (done) {
  testSession
    .post("/users/login")
    .type("form")
    .send({ id: "root", password: "root", _csrf: csrfToken })
    .end(function (err, res) {
      assert.equal(res.status, 302);
      done();
    });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Before add new lesson", () => {
  test("Get empty lesson list", async () => {
    return testSession.get("/admin/lesson/empty").expect(200);
  });
});

describe("Create lessons", () => {
  test("create new lesson", async () => {
    return testSession
      .post("/admin/lesson")
      .type("form")
      .send({
        data: {
          name: "TestLesson",
          teacher: "testteacher",
          description: "testdescription",
        },
        _csrf: csrfToken,
      })
      .expect(200);
  });
});

describe("lesson RUD", () => {
  beforeEach(function (done) {
    testSession
      .post("/admin/lesson")
      .type("form")
      .send({
        data: {
          name: "testLesson",
          teacher: "testTeacher",
          description: "testDescription",
        },
        _csrf: csrfToken,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        done();
      });
  });

  test("Read lessoninfo", async () => {
    return testSession.get("/admin/lesson/" + Lessonid).expect(200);
  });

  test("Update lessoninfo", async () => {
    return testSession;
  });

  test("Delete lesson", async () => {
    return testSession
      .delete("/admin/lesson/${id}")
      .type("form")
      .send({ _csrf: csrfToken })
      .expect(200);
  });
});
