const courseModel = require("../models/course.model");

// create a new course
const createNewCourse = async (req, res) => {
  const { name, code, description, credits } = req.body;

  if (!name || !code || !description || !credits) {
    return res.status(400).json({
      error: "course name, code, description or credits fields are missing.",
    });
  }

  //validate course code
  const courseCodeFormat = /^(IT|SE|HS|BM|ENG)\d{4}$/;
  const validateCourseCode = (code) => {
    return courseCodeFormat.test(code);
  };

  if (!validateCourseCode(code)) {
    return res.status(400).json({
      error: "not a valid course code!",
      cause: "course code is not in correct format!",
    });
  }

  //find a duplicate course with same code
  const duplicateCourseCode = await courseModel.findOne({ code });

  if (duplicateCourseCode) {
    return res.status(401).json({
      error: "course with same code already exists! duplication not allowed!",
    });
  }

  //find a duplicate course with same name
  const duplicateCourseName = await courseModel.findOne({ name });

  if (duplicateCourseName) {
    return res.status(401).json({
      error: "course with same name already exists! duplication not allowed!",
    });
  }

  const createdCourse = await courseModel.create({
    name,
    code,
    description,
    credits,
  });

  if (createdCourse) {
    return res.status(201).json({
      ...createdCourse._doc,
      message: "new course created successfully!",
    });
  } else {
    return res
      .status(400)
      .json({ error: "course could not be crearted! unsuccessful!" });
  }
};

// get all available courses
const getAllCourses = async (req, res) => {
  const allCourses = await courseModel
    .find()
    .populate({
      path: "offered_faculties",
      select:
        "-_id -__v -createdAt -updatedAt -user_roles -password -refresh_token",
    })
    .exec();

  if (allCourses) {
    if (allCourses.length < 1) {
      return res.status(200).json({ message: "no available courses!" });
    }
    return res.status(200).json(allCourses);
  } else {
    return res
      .status(400)
      .json({ error: "can not fetch the courses! unsuccess!" });
  }
};

// get course using object id
const getCourseUsingObjectId = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "course object id is required!" });
  }

  try {
    const foundCourse = await courseModel
      .findById(id)
      .populate({
        path: "offered_faculties",
        select:
          "-user_roles -_id -password -refresh_token -createdAt -updatedAt",
      })
      .exec();

    if (foundCourse) {
      return res.status(200).json(foundCourse);
    } else {
      return res
        .status(404)
        .json({ message: "course could not find! server error!" });
    }
  } catch (error) {
    return res.status(500).json({ error: "internal server error!" });
  }
};

// update a course using course object id
const updateCourseUsingObjectID = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "course object id is required!" });
  }

  try {
    const foundCourse = await courseModel.findById(id);

    if (foundCourse) {
      const { name, description, credits } = req.body;

      if ((!name, !description, !credits)) {
        return res.status(400).json({
          error: "course name, code, description, credits fields required!",
        });
      }

      const updatedCourse = await courseModel.findByIdAndUpdate(
        foundCourse._id,
        {
          name,
          description,
          credits,
        },
        { new: true }
      );

      if (updatedCourse) {
        return res.status(200).json(updatedCourse);
      } else {
        return res
          .status(500)
          .json({ error: "course could not be updated! server error!" });
      }
    } else {
      return res
        .status(404)
        .json({ error: `course with id ${id} does not exist!` });
    }
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
};

// delete a course using course object id
const deleteCourseUsingObjectId = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "course object id is required!" });
  }

  try {
    const foundCourse = await courseModel.findById(id);

    if (foundCourse) {
      const deletedCourse = await courseModel.findByIdAndDelete(id);

      if (deletedCourse) {
        return res.status(200).json({
          message: `course with ${foundCourse.code} deleted successfully!`,
        });
      } else {
        return res
          .status(500)
          .json({ message: "course could not be deleted! server error!" });
      }
    } else {
      return res
        .status(404)
        .json({ error: `course with id ${id} does not exist!` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "internal server error" });
  }
};

module.exports = {
  createNewCourse,
  getAllCourses,
  deleteCourseUsingObjectId,
  updateCourseUsingObjectID,
  getCourseUsingObjectId,
};
