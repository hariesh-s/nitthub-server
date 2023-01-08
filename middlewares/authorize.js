const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function isAuthorized(req, res, next) {
   const { Authorization } = req.headers;

   if (!Authorization)
      res.status(401).json({ message: "Authorization token mandatory!" });

   const token = Authorization.split(" ")[1];

   try {
      const { _id } = jwt.verify(token, process.env.SECRET_KEY_ACCESS);

      // checking if the _id is present in db
      req.user = await User.findOne({ _id }).select("_id");

      next();
   } catch (err) {
      res.status(401).json({ message: "User not authorized!" });
   }
}

module.exports = isAuthorized;
