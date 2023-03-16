const verifyRoles = (...requiredRoles) => {
  return (req, res, next) => {
    if (!req?.roles) {
      return res.json("Roles Error").status(403)};

    const userRoles = Object.values(req.roles ?? {});

    for (const role of requiredRoles) {
      if (!userRoles.includes(role)) {
        return res.status(403).json({ message: "You do not have the required permissions to access this resource." });
      }
    }
    next();
  };
};

export default verifyRoles;