const { User, ShoppingCart } = require("../models");

const createUser = async (req, res) => {
   // body: userId, firstname, lastname, email, password, role
   try {
      const user = await User.create(req.body);
      const shoppingCart = await ShoppingCart.create({ userId: user.id });
      res.status(201).json(user, shoppingCart.id);
   } catch (error) {
      res.status(400).send("User not created: ", error);
   }
}

const updateUser = async (req, res) => {
   // body: userId, firstname, lastname, email, password, role
   try {
      const user = await User.update(req.body, {
         where: { id: req.body.id },
         returning: true
      });
      res.status(201).send(user);
   } catch (error) {
      res.status(400).send("User not updated: ", error);
   }
}

module.exports = { createUser, updateUser }