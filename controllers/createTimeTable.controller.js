const timeTableModel = require("../models/time_table.model");
const facultyModel = require("../models/faculty.model");
const sessionModel = require("../models/class_session.model");
const notificationModel = require("../models/notification.model");

const createTimeTable = async (req, res) => {
  // function for check valid sessions
  const sessionIdChecker = async (sessionArr, faculty_id) => {
    const sessionObjectIds = [];
    const errors = [];
    try {
      await Promise.all(
        sessionArr.map(async (session) => {
          const foundSession = await sessionModel
            .findOne({ session_id: session })
            .exec();
          if (!foundSession) {
            errors.push(`session not found with session ${session}!`);
            return;
          }

          if (foundSession.faculty.toString() !== faculty_id.toString()) {
            errors.push(
              `trying to assign a session that does not belongs to this faculty! ${session}`
            );
            return;
          }
          sessionObjectIds.push(foundSession._id);
        })
      );
      return { sessionObjectIds, errors };
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "internal sever error! (async ops)" });
    }
  };

  // function check for duplicates
  const checkDuplicates = (session_arr) => {
    const errors = [];
    try {
      const duplicates = session_arr.filter((session, index, self) => {
        return self.indexOf(session) !== index;
      });

      if (duplicates.length > 0) {
        errors.push(`duplicate sessiond id found`);
      }
    } catch (error) {
      return res.status(400).json({
        error: "string received to filter function! expected type is an array!",
      });
    }

    return { errors };
  };

  const {
    academic_year,
    faculty_id,
    monday_sessions,
    tuesday_sessions,
    wednesday_sessions,
    thursday_sessions,
    friday_sessions,
  } = req.body;

  // check academic year in valid format
  const academicYearValidator = /^Y[1-4]S[1-2]$/;

  const validateAcademicYear = (year) => {
    return academicYearValidator.test(year);
  };

  if (!validateAcademicYear(academic_year)) {
    return res
      .status(400)
      .json({ error: "academic year not in correct format. etc: Y#S#" });
  }

  // check there is a faculty with entered faculty id
  const foundFaculty = await facultyModel.findOne({ faculty_id }).exec();

  if (!foundFaculty) {
    return res
      .status(400)
      .json({ error: "faculty not found with given faculty id!" });
  }

  // check duplicate session ids in monday sessions and validate sessions
  const monday_session_duplicates = checkDuplicates(monday_sessions);
  const monday_session_id_array = await sessionIdChecker(
    monday_sessions,
    foundFaculty._id
  );

  // check duplicate session ids in tuesday sessions and validate sessions
  const tuesday_session_duplicates = checkDuplicates(tuesday_sessions);
  const tuesday_session_id_array = await sessionIdChecker(
    tuesday_sessions,
    foundFaculty._id
  );

  // check duplicate session ids in wednesday sessions and validate sessions
  const wednesday_session_duplicates = checkDuplicates(wednesday_sessions);
  const wednesday_session_id_array = await sessionIdChecker(
    wednesday_sessions,
    foundFaculty._id
  );

  // check duplicate session ids in thursday sessions and validate sessions
  const thursday_session_duplicates = checkDuplicates(thursday_sessions);
  const thursday_session_id_array = await sessionIdChecker(
    thursday_sessions,
    foundFaculty._id
  );

  // check duplicate session ids in friday sessions and validate sessions
  const friday_session_duplicates = checkDuplicates(friday_sessions);
  const friday_session_id_array = await sessionIdChecker(
    friday_sessions,
    foundFaculty._id
  );

  //check duplicates related issues
  if (
    monday_session_duplicates.errors.length > 0 ||
    tuesday_session_duplicates.errors.length > 0 ||
    wednesday_session_duplicates.errors.length > 0 ||
    thursday_session_duplicates.errors.length > 0 ||
    friday_session_duplicates > 0
  ) {
    return res
      .status(400)
      .json({ error: "duplicate session ids found! please check!" });
  }

  //check session id existence related issues
  if (
    monday_session_id_array.errors.length > 0 ||
    tuesday_session_id_array.errors.length > 0 ||
    wednesday_session_id_array.errors.lenth > 0 ||
    thursday_session_id_array.errors.length > 0 ||
    friday_session_id_array.errors.length > 0
  ) {
    return res.status(400).json({
      error: [
        ...monday_session_id_array.errors,
        ...tuesday_session_id_array.errors,
        ...wednesday_session_id_array.errors,
        ...thursday_session_id_array.errors,
        ...friday_session_id_array.errors,
      ],
    });
  }

  const createdTimeTable = await timeTableModel.create({
    academic_year,
    faculty: foundFaculty._id,
    monday_sessions: monday_session_id_array.sessionObjectIds,
    tuesday_sessions: tuesday_session_id_array.sessionObjectIds,
    wednesday_sessions: wednesday_session_id_array.sessionObjectIds,
    thursday_sessions: thursday_session_id_array.sessionObjectIds,
    friday_sessions: friday_session_id_array.sessionObjectIds,
  });

  if (createdTimeTable) {
    const dispatchNotification = await notificationModel.create({
      type: `${foundFaculty.username} ${createdTimeTable.academic_year} Timetable Published!`,
      message: `Timetable of ${foundFaculty.username} for academic year ${createdTimeTable.academic_year} has been published. ${createdTimeTable.academic_year} students can now check their time tables`,
      createdBy: "Timetable and Session Management System.",
    });

    dispatchNotification
      ? console.log("notification dispatched successfully!")
      : console.log("notification dispatch failed!");

    return res.status(201).json(createdTimeTable);
  } else {
    return res.status(500).json({ error: "internal server error." });
  }
};

module.exports = createTimeTable;
