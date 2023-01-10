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

      const access_token = jwt.sign(payload, process.env.SECRET_KEY_ACCESS, {
         expiresIn: 20, // in seconds
      });

      const refresh_token = jwt.sign(payload, process.env.SECRET_KEY_REFRESH, {
         expiresIn: 60 * 60 * 6, // in seconds
      });

      user_found.refreshToken = refresh_token;

      try {
         await user_found.save();
      } catch (err) {
         return res.status(500).json({ message: "Internal sever error" });
      }

      res.cookie("jwt", refresh_token, {
         httpOnly: true,
         sameSite: "None",
         secure: true,
         maxAge: 1000 * 60 * 60 * 6, // in milli seconds
      });
      console.log(access_token);
      res.status(200).json({
         message: "Logged in successfully!",
         access_token,
      });
   } else return res.status(401).json({ message: "Unauthorized request!" });
}

function isUserLoggedIn(req, res) {
   // middleware does all the checking
   // so if the req reaches the endpt
   // user is logged in
   console.log("success");
   res.sendStatus(200);
}

async function handleLogout(req, res) {
   const cookies = req.cookies;
   console.log(cookies)
   // No content http error (cookie not present)
   if (!cookies?.jwt) return res.status(204).json({ message: "No content!" });

   // clear the cookie
   res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 1000 * 60 * 60 * 6, // in milli seconds
   });

   // reset the user's refresh token in db
   const refreshToken = cookies.jwt;

   const foundUser = await User.findOne({ refreshToken });
   console.log(foundUser.username)
   if (!foundUser) return res.sendStatus(204);

   foundUser.refreshToken = "";
   try {
      await foundUser.save();
      res.status(200).json({ message: "Successfully logged out!" });
   } catch (err) {
      res.status(500).json({ message: "Internal server error!" });
   }
}

module.exports = { handleAuthentication, isUserLoggedIn, handleLogout };
