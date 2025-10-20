const studentModel = require("../models/student.model");
const facultyModel = require("../models/faculty.model");
const adminModel = require("../models/admin.model");
const bcrypt = require("bcrypt");

//student registration method
const createNewStudent = async (req, res) => {
  const { email, username, password, studentId, nic, faculty_id } = req.body;

  if (!email || !username || !password || !studentId || !nic || !faculty_id) {
    return res.status(400).json({
      message:
        "please provide the necessary details (email, password, username, nic, studentId, faculty_id)",
    });
  }

  const saltRounds = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  //check provided email is already registered as any role
  let duplicate = await studentModel.findOne({ email }).exec();

  if (!duplicate) {
    duplicate = await facultyModel.findOne({ email }).exec();
  }

  if (!duplicate) {
    duplicate = await adminModel.findOne({ email }).exec();
  }

  if (duplicate) {
    return res
      .status(400)
      .json({ message: "This email is already registered to the system!" });
  }

  //validate faculty id
  const facultyIdFormat = /^FAC\d{4}$/;

  const facultyIdValidator = (facId) => {
    return facultyIdFormat.test(facId);
  };

  if (!facultyIdValidator(faculty_id)) {
    return res
      .status(400)
      .json({ error: "faculty id is not in the correct format! etc: FAC####" });
  }

  //find a faculty with given faculty id
  const foundFaculty = await facultyModel.findOne({ faculty_id });

  if (!foundFaculty) {
    return res
      .status(400)
      .json({ error: "valid faculty id required. etc: FAC####" });
  }

  const studentIdFormat = /^(IT|SE|BM|ENG|HS)\d{8}$/;

  const studentIdValidator = (stdId) => {
    return studentIdFormat.test(stdId);
  };

  if (!studentIdValidator(studentId)) {
    return res.status(400).json({
      error: "student id is not in the correct format! etc: IT########",
    });
  }

  //check for student id duplications
  const duplicateStudentId = await studentModel.findOne({ studentId }).exec();

  if (duplicateStudentId) {
    return res
      .status(400)
      .json({ error: "entered student id is already exists in the database!" });
  }

  //check for nic duplications
  const duplicateNIC = await studentModel.findOne({ nic }).exec();

  if (duplicateNIC) {
    return res
      .status(400)
      .json({ error: "entered nic is already exists in the database!" });
  }

  try {
    const result = await studentModel.create({
      email,
      username,
      password: hashedPassword,
      studentId,
      nic,
      faculty: foundFaculty._id,
    });

    if (result) {
      const roles = Object.values(result.user_roles);
      return res.status(201).json({
        email: result.email,
        username: result.username,
        roles,
      });
    } else {
      return res
        .status(400)
        .json({ message: "student account could not be created!" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//faculty registration method
const createNewFaculty = async (req, res) => {
  const { email, username, password, faculty_id } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({
      message:
        "please provide the necessary details (email, password, username)",
    });
  }

  //validate faculty id
  const facultyIdFormat = /^FAC\d{4}$/;
  const facultyIdValidator = (facId) => {
    return facultyIdFormat.test(facId);
  };

  if (!facultyIdValidator(faculty_id)) {
    return res
      .status(400)
      .json({ error: "faculty id is not in the correct format! etc: FAC####" });
  }

  const saltRounds = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  //check provided email is already registered as any role
  let duplicate = await studentModel.findOne({ email }).exec();

  if (!duplicate) {
    duplicate = await facultyModel.findOne({ email }).exec();
  }

  if (!duplicate) {
    duplicate = await adminModel.findOne({ email }).exec();
  }

  if (duplicate) {
    return res
      .status(400)
      .json({ message: "This email is already registered to the system!" });
  }

  // check duplicate of faculty name
  const duplicateFacultyName = await facultyModel.findOne({ username });

  if (duplicateFacultyName) {
    return res.status(401).json({
      error: "duplicate faculty name found! please give an unique name!",
    });
  }

  // check duplicate of faculty id
  const duplicateFacultyId = await facultyModel.findOne({ faculty_id });

  if (duplicateFacultyId) {
    return res.status(401).json({
      error: "duplicate faculty id found! please give an unique id!",
    });
  }

  try {
    const result = await facultyModel.create({
      email,
      username,
      password: hashedPassword,
      faculty_id,
    });

    if (result) {
      const roles = Object.values(result.user_roles);
      return res.status(201).json({
        email: result.email,
        username: result.username,
        roles,
      });
    } else {
      return res
        .status(400)
        .json({ message: "faculty account could not be created!" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// admin registration method
const createNewAdmin = async (req, res) => {
  const { email, username, password, admin_id } = req.body;

  if (!email || !username || !password || !admin_id) {
    return res.status(400).json({
      message:
        "please provide the necessary details (email, password, username, admin_id)",
    });
  }

  const saltRounds = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  //check provided email is already registered as any role
  let duplicate = await studentModel.findOne({ email }).exec();

  if (!duplicate) {
    duplicate = await facultyModel.findOne({ email }).exec();
  }

  if (!duplicate) {
    duplicate = await adminModel.findOne({ email }).exec();
  }

  // if found a duplicate
  if (duplicate) {
    return res
      .status(400)
      .json({ message: "This email is already registered to the system!" });
  }

  //check for duplicate admin_id
  const duplicateAdminId = await adminModel.findOne({ admin_id });

  if (duplicateAdminId) {
    return res.status(401).json({
      error: "duplicate admin id found! please give an unique admin id!",
    });
  }

  try {
    const result = await adminModel.create({
      email,
      username,
      admin_id,
      password: hashedPassword,
    });

    if (result) {
      const roles = Object.values(result.user_roles);
      return res.status(201).json({
        email: result.email,
        username: result.username,
        roles,
      });
    } else {
      return res
        .status(400)
        .json({ message: "admin account could not be created!" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  createNewAdmin,
  createNewFaculty,
  createNewStudent,
};
