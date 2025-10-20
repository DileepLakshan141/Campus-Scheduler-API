const mongoose = require("mongoose");
const request = require("supertest");
const { app, serverPromise } = require("../server");
const { generateAccessToken } = require("../controllers/tokenGenerator");
require("dotenv").config();

let createdSession;
// class sessions api units testing
describe("Session Controllers Testing", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_DB_URI);
    await serverPromise;
  });

  afterAll(async () => {
    await mongoose.connection.close();
    const server = await serverPromise;
    server.close();
  });

  //create a session
  it("POST: This operation will create a session in the sessions collection", async () => {
    // Generate a JWT token for faculty authentication
    const token = generateAccessToken({
      username: "Faculty of Information Technology",
      roles: [3493, 6973],
      _id: "65fa5d8b73e48c3015fc632b",
    });

    const res = await request(app)
      .post("/uni-time-table-management/api/class-sessions/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        session_id: "MONIT9999",
        session_category: "Lecture",
        course_code: "IT1010", // existing course id from the db
        faculty_id: "FAC0001", // existing faculty id from the db
        start_time: "08:30",
        end_time: "10:30",
        location: "LH0002", // existing location resource id from the db
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("session_id", "MONIT9999");
    expect(res.body).toHaveProperty("session_category", "Lecture");
    createdSession = res.body;
  });

  //update a session
  it("PUT: This operation will update a created class session", async () => {
    // Generate a JWT token for faculty authentication
    const token = generateAccessToken({
      username: "Faculty of Information Technology",
      roles: [3493, 6973],
      _id: "65fa5d8b73e48c3015fc632b",
    });

    const res = await request(app)
      .put(
        `/uni-time-table-management/api/class-sessions/update/${createdSession._id}`
      )
      .set("Authorization", `Bearer ${token}`)
      .send({
        session_id: "MONIT9999",
        session_category: "Lecture",
        course_code: "IT1010", // existing course id from the db
        faculty_id: "FAC0001", // existing faculty id from the db
        start_time: "12:30", // time updated
        end_time: "14:30", // time updated
        location: "LH0002", // existing location resource id from the db
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("start_time", "12:30");
    expect(res.body).toHaveProperty("end_time", "14:30");
  });

  //get all class sessions
  it("GET: Get all published class sessions!", async () => {
    // Generate a JWT token for faculty authentication
    const token = generateAccessToken({
      username: "Faculty of Information Technology",
      roles: [3493, 6973],
      _id: "65fa5d8b73e48c3015fc632b",
    });

    const res = await request(app)
      .get(`/uni-time-table-management/api/class-sessions/get-all`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  //get single session
  it("GET: Get a specific class session!", async () => {
    // Generate a JWT token for faculty authentication
    const token = generateAccessToken({
      username: "Faculty of Information Technology",
      roles: [3493, 6973],
      _id: "65fa5d8b73e48c3015fc632b",
    });

    const res = await request(app)
      .get(
        `/uni-time-table-management/api/class-sessions/get/${createdSession._id}`
      )
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  // delete a specific session
  it("DELETE: This should delete the class session with given session object id.", async () => {
    // Generate a JWT token for faculty authentication
    const token = generateAccessToken({
      username: "Faculty of Information Technology",
      roles: [3493, 6973],
      _id: "65fa5d8b73e48c3015fc632b",
    });

    const res = await request(app)
      .delete(
        `/uni-time-table-management/api/class-sessions/delete/${createdSession._id}`
      )
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});
