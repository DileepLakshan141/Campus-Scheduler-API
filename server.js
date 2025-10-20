require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/errorMiddleware");
const connectDB = require("./config/connectDb");
const verifyJWT = require("./middlewares/verifyJWTMiddleware");

connectDB();
const app = express();
const PORT = process.env.PORT || 3500;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/uni-time-table-management/api/auth",
  require("./routes/auth-login.routes")
);

app.use(verifyJWT);

app.use(
  "/uni-time-table-management/api/auth",
  require("./routes/auth-register.routes")
);

app.use(
  "/uni-time-table-management/api/courses",
  require("./routes/course.routes")
);

app.use(
  "/uni-time-table-management/api/faculty",
  require("./routes/faculty.routes")
);

app.use(
  "/uni-time-table-management/api/class-sessions",
  require("./routes/class_session.routes")
);

app.use(
  "/uni-time-table-management/api/time-tables",
  require("./routes/time_table.routes")
);

app.use(
  "/uni-time-table-management/api/resources",
  require("./routes/resource.routes")
);

app.use(
  "/uni-time-table-management/api/enrollment",
  require("./routes/enrollment.routes")
);

app.use(
  "/uni-time-table-management/api/student",
  require("./routes/student.routes")
);

app.use(
  "/uni-time-table-management/api/notifications",
  require("./routes/notifications.routes")
);

app.use(errorHandler);

let serverPromise = new Promise((resolve, reject) => {
  mongoose.connection.once("open", () => {
    console.log(`🚀 Connected to the mongo db successfully! 🚀`);
    const server = app.listen(PORT, () => {
      console.log(`🤖 Server is up and running on port: ${PORT} 🤖`);
      resolve(server);
    });
  });
});

module.exports = { app, serverPromise };
