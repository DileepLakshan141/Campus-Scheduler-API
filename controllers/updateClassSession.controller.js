const classSessionModel = require("../models/class_session.model");
const facultyModel = require("../models/faculty.model");
const courseModel = require("../models/course.model");
const resourceModel = require("../models/resource.model");
const notificationModel = require("../models/notification.model");

// update a session using session object id
const updateSessionUsingObjectId = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ error: "please provide a session object id!" });
  }

  const {
    session_category,
    course_code,
    faculty_id,
    start_time,
    end_time,
    location,
  } = req.body;

  if (
    !session_category ||
    !course_code ||
    !faculty_id ||
    !start_time ||
    !end_time ||
    !location
  ) {
    return res.status(400).json({
      error:
        "necessary values missing. etc: session id, course code, faculty id, start_time, end_time, location",
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
      .json({ error: "end time can not be earlier than start time." });
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
    return res
      .status(400)
      .json({ error: "valid location resource is required!" });
  }

  try {
    const foundSession = await classSessionModel.findById(id);

    console.log(foundFaculty._id);

    if (foundSession) {
      const updatedSession = await classSessionModel.findByIdAndUpdate(
        foundSession._id,
        {
          session_category,
          course_code: foundCourse._id,
          faculty: foundFaculty._id,
          start_time,
          end_time,
          location: foundLocation._id,
        },
        { new: true }
      );

      if (updatedSession) {
        // dispatch a notification if the location has changed
        if (
          updatedSession.location.toString() !==
          foundSession.location.toString()
        ) {
          const dispatchNotification = await notificationModel.create({
            type: `${foundCourse.code} ${updatedSession.session_id} Session location has been changed!`,
            message: `Course ${foundCourse.code}(${foundSession.session_category}) is moved to the location ${foundLocation.resource_id}. Check your time tables to see if your session has been changed.`,
            createdBy: `Timetable & Class Sessions Management System`,
          });

          dispatchNotification
            ? console.log("notification dispatched!")
            : console.log("notification could not be send! an error occured!");
        }

        return res.status(200).json(updatedSession);
      } else {
        return res
          .status(400)
          .json({ error: "session can not be updated! server error!" });
      }
    } else {
      return res
        .status(404)
        .json({ error: "session does not exist. can not be updated!" });
    }
  } catch (error) {
    return res.status(500).json({ message: "internal server error!" });
  }
};

module.exports = updateSessionUsingObjectId;
