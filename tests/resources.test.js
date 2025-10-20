const mongoose = require("mongoose");
const request = require("supertest");
const { app, serverPromise } = require("../server");
const { generateAccessToken } = require("../controllers/tokenGenerator");
require("dotenv").config();

let createdResource;
// resource api units testing
describe("Resource Controllers Testing", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_DB_URI);
    await serverPromise;
  });

  afterAll(async () => {
    await mongoose.connection.close();
    const server = await serverPromise;
    server.close();
  });

  //create a resource
  it("POST: This operation will create a new resource in the resource collection", async () => {
    // Generate a JWT token for admin authentication
    const token = generateAccessToken({
      username: "Dileep Lakshan",
      roles: [3493, 6973, 9353],
      _id: "65fbc6dd8b5cd14868959ba0",
    });

    const res = await request(app)
      .post("/uni-time-table-management/api/resources/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        resource_id: "LH9999", //mock resource id
        resource_name: "Lecture Hall 9999", // mock resource value
        resource_type: "Lecture Hall",
        bookedBy: null,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("resource_name", "Lecture Hall 9999");
    expect(res.body).toHaveProperty("resource_type", "Lecture Hall");
    createdResource = res.body;
  });

  //book a resource
  it("PUT: This operation will book an available resource", async () => {
    // Generate a JWT token for faculty authentication
    const token = generateAccessToken({
      username: "Faculty of Information Technology",
      roles: [3493, 6973],
      _id: "65fa5d8b73e48c3015fc632b",
    });

    const res = await request(app)
      .put(
        `/uni-time-table-management/api/resources/book-resource/${createdResource._id}`
      )
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("bookedBy", "65fa5d8b73e48c3015fc632b");
    expect(res.body).toHaveProperty("bookedByModel", "Faculty");
  });

  //book a resource that is already booked by other
  it("PUT: This operation will prevent overlapping (block booking a resource that already booked)", async () => {
    // Generate a JWT token for faculty authentication
    const token = generateAccessToken({
      username: "Faculty of Software Engineering",
      roles: [3493, 6973],
      _id: "65fa5dc973e48c3015fc6332",
    });

    const res = await request(app)
      .put(
        `/uni-time-table-management/api/resources/book-resource/${createdResource._id}`
      )
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "action not allowed!");
    expect(res.body).toHaveProperty(
      "cause",
      "this resource is already booked! not available"
    );
  });

  //release a resource that was booked by another person
  it("PUT: This operation will prevent releasing resources that was booked by another person", async () => {
    // Generate a JWT token for faculty authentication
    const token = generateAccessToken({
      username: "Faculty of Software Engineering",
      roles: [3493, 6973],
      _id: "65fa5dc973e48c3015fc6332",
    });

    const res = await request(app)
      .put(
        `/uni-time-table-management/api/resources/release-resource/${createdResource._id}`
      )
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "action not allowed!");
    expect(res.body).toHaveProperty(
      "cause",
      "this resource is not booked with your user credentials!"
    );
  });

  //release a resource that was booked by the same person
  it("PUT: Release a resource that was booked by the same person", async () => {
    // Generate a JWT token for faculty authentication
    const token = generateAccessToken({
      username: "Faculty of Information Technology",
      roles: [3493, 6973],
      _id: "65fa5d8b73e48c3015fc632b",
    });

    const res = await request(app)
      .put(
        `/uni-time-table-management/api/resources/release-resource/${createdResource._id}`
      )
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty(
      "message",
      "resource released successfully!"
    );
  });

  //get all resources
  it("GET: Get all the available resources!", async () => {
    // Generate a JWT token for faculty authentication
    const token = generateAccessToken({
      username: "Faculty of Information Technology",
      roles: [3493, 6973],
      _id: "65fa5d8b73e48c3015fc632b",
    });

    const res = await request(app)
      .get(`/uni-time-table-management/api/resources/get-all`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  //get single resource
  it("GET: Get a resource with valid resource object id!", async () => {
    // Generate a JWT token for faculty authentication
    const token = generateAccessToken({
      username: "Faculty of Information Technology",
      roles: [3493, 6973],
      _id: "65fa5d8b73e48c3015fc632b",
    });

    const res = await request(app)
      .get(
        `/uni-time-table-management/api/resources/get/${createdResource._id}`
      )
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  // delete a specific resource
  it("DELETE: This should delete the resource with given resource object id.", async () => {
    // Generate a JWT token for admin authentication
    const token = generateAccessToken({
      username: "Dileep Lakshan",
      roles: [3493, 6973, 9353],
      _id: "65fbc6dd8b5cd14868959ba0",
    });

    const res = await request(app)
      .delete(
        `/uni-time-table-management/api/resources/delete-resource/${createdResource._id}`
      )
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});
