const fsPromises = require("fs").promises;
const fs = require("fs");
const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const path = require("path");

const logEvents = async (message, file) => {
  const logDateTime = `${format(new Date(), "yyyy/MM/dd \t HH:mm:ss")}`;
  const logItem = `${logDateTime} \t ${uuid()} \t ${message} \n`;

  if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
    await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    console.log("logs directory created!");
  }

  try {
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", file),
      logItem
    );
  } catch (error) {
    console.error(error);
  }
};

module.exports = logEvents;
