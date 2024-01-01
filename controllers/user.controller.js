const { User, ShoppingCart } = require("../models");

const createUser = async (req, res) => {
   // body: userId, firstname, lastname, email, password, role
   try {
      const user = await User.create(req.body);
      const shoppingCart = await ShoppingCart.create({
         userId: user.id,
         subtotal: 0,
         shippingFee: 0,
         paymentMethod: 'card',
         total: 0
      });
      res.status(201).json({ user: user, shoppingCartId: shoppingCart.id });
   } catch (error) {
      res.status(400).send("User not created: " + error);
   }
}

const updateUser = async (req, res) => {
   // body: userId, firstname, lastname, email, password, role
   try {
      const user = await User.findByPk(req.body.id);
      user.update(req.body);
      await user.save();
      res.status(201).send(user);
   } catch (error) {
      res.status(400).send("User not updated: " + error);
   }
}

module.exports = { createUser, updateUser }