const User = require("../models/User");

async function generateNewToken() {
   const cookies = req.cookies;
   if (!cookies?.jwt) return res.sendStatus(401);
   const refreshToken = cookies.jwt;

   const foundUser = User.find(
      (person) => person.refreshToken === refreshToken
   );
   if (!foundUser) return res.status(403).json({ message: "User not found!" });

   try {
      const { _id } = jwt.verify(token, process.env.SECRET_KEY_REFRESH);

      if (_id !== foundUser._id)
         return res.status(403).json({ message: "User not authorized!" });

      const access_token = jwt.sign(payload, process.env.SECRET_KEY_ACCESS, {
         expiresIn: 1000 * 60 * 5,
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
