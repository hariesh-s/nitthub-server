const User = require("../models/User");
const bcrypt = require("bcrypt");

async function handleRegistration(req, res) {
   const { username, password } = req.body;

   if (!username || !password)
      return res
         .status(400) // bad request
         .json({ message: "Username and password are required!" });

   const user_already_exists = await User.findOne({
      username: username,
   }).exec();

   if (user_already_exists)
      return res
         .status(409) // status for conflict
         .json({ message: "Username is taken! Try a different one" });

   try {
      const hashed_password = await bcrypt.hash(password, 10);
      const new_user = await User.create({
         username: username,
         password: hashed_password,
      });
      res.status(201).json({ message: "New user successfully created!" });
   } catch (err) {
      res.status(500).json({ message: err });
   }
}

module.exports = { handleRegistration };
