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
        return testSession
            .get("/admin/lesson/empty")
            .expect(200)
    });
});

describe("Lessons CRUD", () =>{
    beforeEach(function (done) {
        testSession
          .get("/admin/lesson/empty")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            done();
          });
      });
/*
    test("create new lesson", async () => {
        addLesson(
            name, "testLesson",
            teacher, "testteacher",
            description, "testdescription",
            _csrf, csrfToken,
        )
    });
*/
    test("create new lesson", async () => {
        return testSession
            .post("/admin/lesson")
            .type("string")
            .send({
                name: "TestLesson",
                teacher: "testteacher",
                description: "testdescription",
                _csrf: csrfToken,
                //fixed:true,
            })
            .expect(200)
            .expect("Location", "/admin/lesson");
    });

    test("Read lessoninfo", async () => {
        return testSession
    });

    test("Update lessoninfo", async () => {
        return testSession
    });

    test("Delete lesson", async () => {
        return testSession

    })

});