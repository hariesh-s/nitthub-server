const User = require("../models/User");
const bcrypt = require("bcrypt");

async function handleAuthentication(req, res) {
   const { username, password } = req.body;

   if (!username || !password)
      return res
         .status(400) // bad request
         .json({ message: "Username and password are required!" });

   const user_found = await User.findOne({ username: username }).exec();

   if (!user_found) return res.status(401).json({ message: "Unauthorized!" });

   const password_match = await bcrypt.compare(password, user_found.password);
   if (password_match) {
      const user_session = { id: user_found._id, name: user_found.username };

      // auto saves session data in mongo store
      req.session.user = user_session;

      // auto sends cookie with session id as response
      res.json({ message: "Logged in successfully!", user_session });
   } else return res.status(401).json({ message: "Unauthorized!" });
}

function handleLogout(req, res) {
   req.session.destroy((err) => {
      if (err) {
         console.log(err);
         res.send(err);
      }

      res.clearCookie(process.env.SESSION_SECRET);
      res.json({ message: "Logged out successfully!" });
   });
}

function isUserLoggedIn(req, res) {
   const user_session = req.session.user; // was created during login
   if (user_session)
      return res.json({ message: "Authenticated successfully!", user_session });
   else return res.status(401).json({ message: "Unauthorized!" });
}

module.exports = { handleAuthentication, handleLogout, isUserLoggedIn };
