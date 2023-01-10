const User = require("../models/User");

async function generateNewToken(req, res) {
   const cookies = req.cookies;
   if (!cookies?.jwt) return res.sendStatus(401);
   const refreshToken = cookies.jwt;

   const user_found = User.findOne({ refreshToken });
   if (!user_found) return res.status(403).json({ message: "User not found!" });

   try {
      const { _id } = jwt.verify(token, process.env.SECRET_KEY_REFRESH);

      if (_id !== user_found._id)
         return res.status(403).json({ message: "User not authorized!" });

      const access_token = jwt.sign(payload, process.env.SECRET_KEY_ACCESS, {
         expiresIn: 20, // in seconds
      });

      res.status(200).json({
         message: "Access token refreshed!",
         access_token,
      });
   } catch (err) {
      res.status(403).json({ message: "User not authorized!" });
   }
}

module.exports = { generateNewToken };
