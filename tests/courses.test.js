const mongoose = require("mongoose");
const request = require("supertest");
const { app, serverPromise } = require("../server");
const { generateAccessToken } = require("../controllers/tokenGenerator");
require("dotenv").config();

let createdCourse;

// course api units testing
describe("Course Controllers Testing", () => {
  beforeAll(async () => {
    await serverPromise;
    await mongoose.connect(process.env.MONGO_DB_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    const server = await serverPromise;
    server.close();
  });

  it("POST: This operation will create a new course in the course collection", async () => {
    // Generate a JWT token for admin authentication
    const token = generateAccessToken({
      username: "Dileep Lakshan",
      roles: [3493, 6973, 9353],
      _id: "65fbc6dd8b5cd14868959ba0",
    });

    const res = await request(app)
      .post("/uni-time-table-management/api/courses/create-course")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "A mock course name",
        code: "IT9999", //mock course code
        description: "A mock description",
        credits: 1,
      });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("A mock course name");
    expect(res.body.message).toBe("new course created successfully!");

    createdCourse = res.body;
  });

  //trying to assign added course to the faculty
  it("POST: should assign a faculty to a course", async () => {
    // Generate a JWT token for admin authentication
    const token = generateAccessToken({
      username: "Dileep Lakshan",
      roles: [3493, 6973, 9353],
      _id: "65fbc6dd8b5cd14868959ba0",
    });

    const res = await request(app)
      .post("/uni-time-table-management/api/courses/assign-faculty")
      .set("Authorization", `Bearer ${token}`)
      .send({ course_code: "IT9999", faculty_id: "FAC0002" });
    expect(res.status).toBe(200);
  });

  //get all faculties who offer that course when course id is passed
  it("GET: display faculties who offer particular course", async () => {
    // Generate a JWT token for admin authentication
    const token = generateAccessToken({
      username: "Dileep Lakshan",
      roles: [3493, 6973, 9353],
      _id: "65fbc6dd8b5cd14868959ba0",
    });

    const res = await request(app)
      .get(
        `/uni-time-table-management/api/courses/offering-faculties/${createdCourse._id}`
      )
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  // trying to assign a course to a faculty that is already assigned to it
  it("POST: should assign a faculty to a course", async () => {
    // Generate a JWT token for admin authentication
    const token = generateAccessToken({
      username: "Dileep Lakshan",
      roles: [3493, 6973, 9353],
      _id: "65fbc6dd8b5cd14868959ba0",
    });

    const res = await request(app)
      .post("/uni-time-table-management/api/courses/assign-faculty")
      .set("Authorization", `Bearer ${token}`)
      .send({ course_code: "IT9999", faculty_id: "FAC0002" });

    // because we have already assigned this to the faculty, error should be generated
    expect(res.status).toBe(400);
  });

  // unassign a faculty from a course
  it("POST: should unassign a course from faculty", async () => {
    // Generate a JWT token for admin authentication
    const token = generateAccessToken({
      username: "Dileep Lakshan",
      roles: [3493, 6973, 9353],
      _id: "65fbc6dd8b5cd14868959ba0",
    });

    const res = await request(app)
      .post("/uni-time-table-management/api/courses/unassign-faculty")
      .set("Authorization", `Bearer ${token}`)
      .send({ course_code: "IT9999", faculty_id: "FAC0002" });
    expect(res.status).toBe(200);
  });

  //update an existing course
  it("PUT: This operation will update an existing course", async () => {
    // Generate a JWT token for admin authentication
    const token = generateAccessToken({
      username: "Dileep Lakshan",
      roles: [3493, 6973, 9353],
      _id: "65fbc6dd8b5cd14868959ba0",
    });

    const res = await request(app)
      .put(
        `/uni-time-table-management/api/courses/update-course/${createdCourse._id}`
      )
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "An updated mock course name!",
        description: "An updated mock description!",
        credits: 2,
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("name", "An updated mock course name!");
    expect(res.body).toHaveProperty(
      "description",
      "An updated mock description!"
    );
  });

  //get all available courses
  it("GET: This should return array of all available courses.", async () => {
    // Generate a JWT token for student authentication
    const token = generateAccessToken({
      username: "James Anderson",
      roles: [3493],
      _id: "65fa5d8b73e48c3015fc632b",
    });

    const res = await request(app)
      .get("/uni-time-table-management/api/courses/get-all-courses")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  // get an specific available course
  it("GET: This should return existing a course.", async () => {
    // Generate a JWT token for student authentication
    const token = generateAccessToken({
      username: "James Anderson",
      roles: [3493],
      _id: "65fa5d8b73e48c3015fc632b",
    });

    const res = await request(app)
      .get(
        `/uni-time-table-management/api/courses/get-course/${createdCourse._id}`
      )
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  // delete a specific course
  it("DELETE: This should delete the course with given course id.", async () => {
    // Generate a JWT token for admin authentication
    const token = generateAccessToken({
      username: "Dileep Lakshan",
      roles: [3493, 6973, 9353],
      _id: "65fbc6dd8b5cd14868959ba0",
    });

    const res = await request(app)
      .delete(
        `/uni-time-table-management/api/courses/delete-course/${createdCourse._id}`
      )
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});
