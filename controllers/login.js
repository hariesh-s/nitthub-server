const User = require("../models/User");
const bcrypt = require("bcrypt");

async function handleAuthentication(req, res) {
   const { username, password } = req.body;

   if (!username || !password)
      return res
         .status(400) //bad request
         .json({ message: "Username and password are required!" });

   const user_found = await User.findOne({ username: username }).exec();

   if (!user_found) return res.status(401).json({ message: "Unauthorized" });

   const password_match = await bcrypt.compare(password, user_found.password);
   if (password_match) {
      
   } else return res.sendStatus(401);
}

// const handleLogout = (req, res) => {
//    const cookies = req.cookies;
//    if (!cookies?.jwt) return res.sendStatus(204); //no content
//    res.clearCookie("jwt", {
//       httpOnly: true,
//       sameSite: "None",
//    });
//    res.json({ message: "cookie cleared" });
// };

module.exports = { handleAuthentication };
