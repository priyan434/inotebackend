const jwt = require('jsonwebtoken');
const JWT_SECRET="iampriyan@webdeveloper"

const fetchuser = (req, res, next) =>
  //Get user frm jwt token and add id to req object
  {
    const token = req.header("auth-token");

    if (!token) {
      res.status(401).send({ error: "Invalid Token" });
    }
    try {
      const data = jwt.verify(token, JWT_SECRET);

      req.user = data.user;

      next();
    } catch (error) {
      res.status(401).send({ error: "Please authenticate with a valid token" });
    }
  };


module.exports=fetchuser;