const logger = (req, res, next) => {
  console.log("Logging from logger middleware");
  next();
};

module.exports = logger;
