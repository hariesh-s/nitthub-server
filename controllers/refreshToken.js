const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function generateNewToken(req, res) {
   const cookies = req.cookies;
   if (!cookies?.jwt) return res.sendStatus(401);
   const refreshToken = cookies.jwt;
   console.log("refresh token ", refreshToken)
   const user_found = await User.findOne({ refreshToken });
   console.log("user found ", user_found)
   if (!user_found) return res.status(403).json({ message: "User not found!" });

   try {
      const result = jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH);
      console.log("result ", result)
      console.log("user id ", user_found._id)
      // ObjectId needs to be converted to string for comparison
      if (result._id !== user_found._id.toString())
         return res.status(403).json({ message: "User not authorized!" });

      const payload = { _id: user_found._id, username: user_found.username };
      const access_token = jwt.sign(payload, process.env.SECRET_KEY_ACCESS, {
         expiresIn: 60, // in seconds
      });

      res.status(200).json({
         message: "Access token refreshed!",
         access_token,
      });
   } catch (err) {
      console.log(err)
      res.status(403).json({ message: "User not authorized!" });
   }
}

module.exports = { generateNewToken };
