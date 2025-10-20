const mongoose = require("mongoose");
const request = require("supertest");
const { app, serverPromise } = require("../server");
const { generateAccessToken } = require("../controllers/tokenGenerator");
require("dotenv").config();

// Enrollment api units testing
describe("Enrollment Controllers Testing", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_DB_URI);
    await serverPromise;
  });

  afterAll(async () => {
    await mongoose.connection.close();
    const server = await serverPromise;
    server.close();
  });

  //enroll student to a course
  it("POST: This operation will enroll a student to a course offered by his faculty", async () => {
    // Generate a JWT token for admin authentication
    const token = generateAccessToken({
      username: "Dileep Lakshan",
      roles: [3493, 6973, 9353],
      _id: "65fbc6dd8b5cd14868959ba0",
    });

    const res = await request(app)
      .post(
        "/uni-time-table-management/api/enrollment/enroll-student/65fa8e67c88349b8a68ee2b8/65fc16128900015717201a9a"
      )
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty(
      "message",
      "StudentId: IT21045398 enrolled to the course IT1060 successfully!"
    );
  });

  // unenroll student from a course
  it("DELETE: This operation will unenroll a student to a course offered by his faculty (executed with Admin credentials)", async () => {
    // Generate a JWT token for admin authentication
    const token = generateAccessToken({
      username: "Dileep Lakshan",
      roles: [3493, 6973, 9353],
      _id: "65fbc6dd8b5cd14868959ba0",
    });

    const res = await request(app)
      .delete(
        `/uni-time-table-management/api/enrollment/unenroll-student/65fa8e67c88349b8a68ee2b8/65fc16128900015717201a9a`
      )
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  //self enrollment to a course by a student
  it("POST: This allow student to enroll a course offered by his faculty.", async () => {
    // Generate a JWT token for student authentication
    const token = generateAccessToken({
      username: "James Anderson",
      roles: [3493],
      _id: "65fc16128900015717201a9a",
    });

    const res = await request(app)
      .post(
        "/uni-time-table-management/api/enrollment/enroll-to-course/65fa8e67c88349b8a68ee2b8"
      )
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty(
      "message",
      "you(Student ID: IT21045398) enrolled to the course IT1060 successfully!"
    );
    createdResource = res.body;
  });

  // unenroll student from a course (by faculty credits)
  it("DELETE: This operation will unenroll a student to a course offered by his faculty (executed with Faculty credentials)", async () => {
    // Generate a JWT token for faculty authentication
    const token = generateAccessToken({
      username: "Faculty of Information Technology",
      roles: [3493, 6973],
      _id: "65fa5d8b73e48c3015fc632b",
    });

    const res = await request(app)
      .delete(
        `/uni-time-table-management/api/enrollment/unenroll-student/65fa8e67c88349b8a68ee2b8/65fc16128900015717201a9a`
      )
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});
