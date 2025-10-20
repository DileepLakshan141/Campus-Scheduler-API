const verifyUserRoles = (...authorized_user_roles) => {
  return (req, res, next) => {
    if (!req?.roles) {
      return res.status(401).send("roles can not be found");
    }
    const roles = [...authorized_user_roles];
    const result = req.roles
      .map((role) => roles.includes(role))
      .find((val) => val === true);

    if (!result)
      return res.status(401).send("Your user role is not authorized to access");

    next();
  };
};

module.exports = verifyUserRoles;
