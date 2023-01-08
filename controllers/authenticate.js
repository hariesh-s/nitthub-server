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

   const user_found = await User.findOne({ username: username });

   if (!user_found) return res.status(401).json({ message: "Unauthorized!" });

   const password_match = await bcrypt.compare(password, user_found.password);

   if (password_match) {
      const payload = { _id: user_found._id, username: user_found.username };

      // valid for 6 hours
      const token = jwt.sign(payload, process.env.SECRET_KEY, {
         expiresIn: 1000 * 60 * 60 * 6,
      });

      res.json({ message: "Logged in successfully!", token });
   } else return res.status(401).json({ message: "Unauthorized!" });
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

module.exports = { handleAuthentication };
