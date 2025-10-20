const classSessionModel = require("../models/class_session.model");
const facultyModel = require("../models/faculty.model");
const courseModel = require("../models/course.model");
const resourceModel = require("../models/resource.model");

// create a new session
const createNewSession = async (req, res) => {
  const {
    session_id,
    session_category,
    course_code,
    faculty_id,
    start_time,
    end_time,
    location,
  } = req.body;

  if (
    !session_id ||
    !session_category ||
    !course_code ||
    !faculty_id ||
    !start_time ||
    !end_time ||
    !location
  ) {
    return res.status(400).json({
      error:
        "necessary values missing. etc: session id, category, course code, faculty id, start_time, end_time, location",
    });
  }

  //validate session id format
  const sessionIdFormat =
    /^(MON|TUE|WED|THU|FRI|SAT|SUN)(IT|SE|HS|ENG|BM)\d{4}$/;

  const sessionIdValidator = (sessionId) => {
    return sessionIdFormat.test(sessionId);
  };

  if (!sessionIdValidator(session_id)) {
    return res
      .status(400)
      .json({
        error: "session id is not in the correct format! etc: MONIT####",
      });
  }

  // validating the location
  const locationIdFormat = /^(LAB|CR|AUD|LH)\d{4}$/;
  const validateLocationId = (id) => {
    return locationIdFormat.test(id);
  };

  if (!validateLocationId(location)) {
    return res.status(400).json({
      error: "location id is not a valid one!",
      message: "it should start with either LAB,CR,AUD,LH and then 4 digits.",
      sample: "CR9020 (stands for -> 'ClassRoom with id 9020')",
    });
  }

  // check if session id is already there
  const duplicateSession = await classSessionModel
    .findOne({ session_id })
    .exec();

  if (duplicateSession) {
    return res.status(400).json({
      error: "entered session id is already exist in the database!",
    });
  }

  // regex logic to validate start time and end time
  const timeformat = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

  // function that using to test the regex
  const isValidTimeSlot = (time) => {
    return timeformat.test(time);
  };

  // what if time is not in desired format
  if (!isValidTimeSlot(start_time) || !isValidTimeSlot(end_time)) {
    return res.status(400).json({
      error: "start time or end time is not in correct format! format is HH:MM",
    });
  }

  const [startHour, startMinute] = start_time.split(":").map(Number);
  const [endHour, endMinute] = end_time.split(":").map(Number);

  const startTimeInMinutes = startHour * 60 + startMinute;
  const endTimeInMinutes = endHour * 60 + endMinute;

  if (endTimeInMinutes <= startTimeInMinutes) {
    return res
      .status(400)
      .json({ error: "end time can not be earlier than start time" });
  }

  //check the course code exists
  const foundCourse = await courseModel.findOne({ code: course_code }).exec();

  if (!foundCourse) {
    return res.status(400).json({ error: "valid course code is required!" });
  }

  // check the faculty exists
  const foundFaculty = await facultyModel.findOne({ faculty_id }).exec();

  if (!foundFaculty) {
    return res.status(400).json({ error: "valid faculty id is required!" });
  }

  // check faculty has authority to offer the course
  if (!foundCourse.offered_faculties.includes(foundFaculty._id)) {
    return res.status(400).json({
      error: "provided faculty is not authorized to offer this course!",
    });
  }

  // check if entered location is an exsiting resource
  const foundLocation = await resourceModel
    .findOne({ resource_id: location })
    .exec();

  if (!foundLocation) {
    return res.status(400).json({ error: "valid location is required!" });
  }

  const createdSession = await classSessionModel.create({
    session_id,
    session_category,
    course: foundCourse._id,
    faculty: foundFaculty._id,
    start_time,
    end_time,
    location: foundLocation._id,
  });

  if (createdSession) {
    return res.status(201).json(createdSession);
  } else {
    return res.status(500).json({ error: "internal server error!" });
  }
};

module.exports = createNewSession;
