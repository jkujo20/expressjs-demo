const auth = (req, res, next) => {
  console.log("Logging from auth middleware");
  if (req.query.admin === "true") {
    req.admin = true;
    next();
  } else {
    res.send("Not Authenticated ");
  }
};

module.exports = auth;
