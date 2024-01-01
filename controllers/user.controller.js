const { User } = require("../models");

const createUser = async (req, res) => {
   try {
      const user = await User.create(req.body);
      res.status(201).send("User created");
   } catch (error) {
      res.status(400).send("User not created");
   }
}

module.exports = { createUser }