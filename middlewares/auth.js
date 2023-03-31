const auth = (req, res, next) =>{
  console.log("Logging auth middleware");
  
  if (req.query.authenticated === "true"){
    req.authenticated = true;
    next();
  }
  else {
    res.send("Not Authenticated");
  }


}

module.exports = auth;