const mongoose = require("mongoose");
const session = require("supertest-session");
const cheerio = require("cheerio");
const assert = require("assert");
const User = require("../models/user.js");
const Building = require("../models/building.js");
const Classroom = require("../models/classroom.js");
const Floor = require("../models/floor.js");
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

describe("Create building test.", () => {
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
  test("Create a new building", async () => {
    return testSession
      .post("/admin/classroom/building")
      .type("form")
      .send({ data: { name: "TestBuilding" }, _csrf: csrfToken })
      .expect(200);
  });

  test("Create a new floor", async () => {
    return testSession
      .post("/admin/classroom/floor")
      .type("form")
      .send({
        data: { building: "TestBuilding", name: "1f" },
        _csrf: csrfToken,
      })
      .expect(200);
  });

  test("Create a new classroom", async () => {
    return testSession
      .post("/admin/classroom/")
      .type("form")
      .send({
        data: {
          building: "TestBuilding",
          floor: "1f",
          name: "103",
          capacity: 70,
          schedule: [],
          options: ["computer"],
        },
        _csrf: csrfToken,
      })
      .expect(200);
  });

  test("Editing a classroom", async () => {
    return testSession
      .put("/admin/classroom//building/TestBuilding/floor/1f/classroom/103")
      .type("form")
      .send({
        data: {
          building: "TestBuilding",
          floor: "1f",
          name: "1040",
          capacity: 40,
          schedule: [],
          options: ["computer"],
        },
        _csrf: csrfToken,
      })
      .expect(200);
  });

  session(app)
    .get("/admin/classroom")
    .end(function (err, res) {
      const $ = cheerio.load(res.text);
      res.get(
        "/building/${building.name}/floor/${floor.name}/classroom/${classroom.name}",
        function (data) {
          expect(data.Building).toBe("TestBuilding");
          expect(data.floor).toBe("1f");
          expect(data.name).toBe("1040");
          expect(data.capacity).toBe(40);
        }
      );
      expect((data = "40"));
    });

  test("Delete a classroom", async () => {
    return testSession
      .delete("/admin/classroom//building/TestBuilding/floor/1f/classroom/1040")
      .type("form")
      .send({ _csrf: csrfToken })
      .expect(200);
  });

  test("Delete a floor", async () => {
    return testSession
      .delete("/admin/classroom/building/TestBuilding/floor/1f")
      .type("form")
      .send({ _csrf: csrfToken })
      .expect(200);
  });

  test("Delete a building", async () => {
    return testSession
      .delete("/admin/classroom//building/TestBuilding")
      .type("form")
      .send({ _csrf: csrfToken })
      .expect(200);
  });

  test("Delete a non existing classroom", async () => {
    return testSession
      .delete("/admin/classroom//building/nonb/floor/nonfl/classroom/noncl")
      .type("form")
      .send({ _csrf: csrfToken })
      .expect(400);
  });

  test("Delete a non existing floor", async () => {
    return testSession
      .delete("/admin/classroom//building/nob/floor/nof")
      .type("form")
      .send({ _csrf: csrfToken })
      .expect(400);
  });

  test("Delete a non existing building", async () => {
    return testSession
      .delete("/admin/classroom//building/nb")
      .type("form")
      .send({ _csrf: csrfToken })
      .expect(400);
  });
});
