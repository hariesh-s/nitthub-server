const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function handleAuthentication(req, res) {
   const { username, password } = req.body;

   // bad request
   if (!username || !password)
      return res
         .status(400)
         .json({ message: "Username and password are required!" });

   const user_found = await User.findOne({ username });

   if (!user_found)
      return res.status(401).json({ message: "User not registered!" });

   const password_match = await bcrypt.compare(password, user_found.password);

   if (password_match) {
      const payload = { _id: user_found._id, username: user_found.username };

      // valid for 5 mins
      const access_token = jwt.sign(payload, process.env.SECRET_KEY_ACCESS, {
         expiresIn: 1000 * 60 * 5,
      });

      // valid for 6 hours
      const refresh_token = jwt.sign(payload, process.env.SECRET_KEY_REFRESH, {
         expiresIn: 1000 * 60 * 60 * 6,
      });

      res.cookie("rt-jwt", refresh_token, {
         httpOnly: true,
         sameSite: "None",
         maxAge: 1 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
         message: "Logged in successfully!",
         access_token,
      });
   } else return res.status(401).json({ message: "Unauthorized request!" });
}

// function handleLogout(req, res) {
//    req.session.destroy((err) => {
//       if (err) {
//          console.log(err);
//          res.send(err);
//       }

//       res.clearCookie(process.env.SESSION_SECRET);
//       res.json({ message: "Logged out successfully!" });
//    });
// }

// function isUserLoggedIn(req, res) {
//    const user_session = req.session.user; // was created during login
//    if (user_session)
//       return res.json({ message: "Authenticated successfully!", user_session });
//    else return res.status(401).json({ message: "Unauthorized!" });
// }

function renewToken(req, res) {
   
}

module.exports = { handleAuthentication, renewToken };
