const mongoose = require("mongoose");
const request = require("supertest");
const { app, serverPromise } = require("../server");
const { generateAccessToken } = require("../controllers/tokenGenerator");
require("dotenv").config();

let createdNotification;
// notifications api units testing
describe("Notifications Controllers Testing", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_DB_URI);
    await serverPromise;
  });

  afterAll(async () => {
    await mongoose.connection.close();
    const server = await serverPromise;
    server.close();
  });

  //create a notification(by a faculty)
  it("POST: This operation will create a notification (By Faculty Side)", async () => {
    // Generate a JWT token for faculty authentication
    const token = generateAccessToken({
      username: "Faculty of Information Technology",
      roles: [3493, 6973],
      _id: "65fa5d8b73e48c3015fc632b",
    });

    const res = await request(app)
      .post("/uni-time-table-management/api/notifications/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        type: "this is an mock announcement!",
        message: "this is an mock announcement message.",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("type", "this is an mock announcement!");
    expect(res.body).toHaveProperty(
      "createdBy",
      "Faculty of Information Technology"
    );
    createdNotification = res.body;
  });

  //get all notifications
  it("GET: Get all the published notifications!", async () => {
    // Generate a JWT token for student authentication
    const token = generateAccessToken({
      username: "James Anderson",
      roles: [3493],
      _id: "65fc16128900015717201a9a",
    });

    const res = await request(app)
      .get(`/uni-time-table-management/api/notifications/get-all`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  //get single notification
  it("GET: Get a specific notification!", async () => {
    // Generate a JWT token for student authentication
    const token = generateAccessToken({
      username: "James Anderson",
      roles: [3493],
      _id: "65fc16128900015717201a9a",
    });

    const res = await request(app)
      .get(
        `/uni-time-table-management/api/notifications/get/${createdNotification._id}`
      )
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  // delete a specific notification
  it("DELETE: This should delete a specific notification.", async () => {
    // Generate a JWT token for admin authentication
    const token = generateAccessToken({
      username: "Dileep Lakshan",
      roles: [3493, 6973, 9353],
      _id: "65fbc6dd8b5cd14868959ba0",
    });

    const res = await request(app)
      .delete(
        `/uni-time-table-management/api/notifications/delete/${createdNotification._id}`
      )
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});
