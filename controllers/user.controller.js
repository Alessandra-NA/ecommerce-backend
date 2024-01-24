const { User, ShoppingCart } = require("../models");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');

dotenv.config();

const createUser = async (req, res) => {
   // body: userId, firstname, lastname, email, password, role
   const salt = await bycrypt.genSalt(10);
   const hashedPassword = await bycrypt.hash(req.body.password, salt);

   try {
      const user = await User.create({
         userId: req.body.userId,
         firstname: req.body.firstname,
         lastname: req.body.lastname,
         email: req.body.email,
         password: hashedPassword,
         role: req.body.role
      });
      const shoppingCart = await ShoppingCart.create({
         userId: user.id,
         subtotal: 0,
         shippingFee: 0,
         paymentMethod: 'card',
         total: 0
      });

      const { password, ...userData } = user.dataValues
      const token = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: '1d' });
      res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 })
      res.status(201).json({ user: userData, shoppingCart });
   } catch (error) {
      res.status(400).send("User not created: " + error);
   }
}

const loginUser = async (req, res) => {
   // body: email, password
   try {
      const user = await User.findOne({ where: { email: req.body.email } });
      if (user && (await bycrypt.compare(req.body.password, user.password))) {
         const { password, ...userData } = user.dataValues
         const token = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: '1d' });
         res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 })
         res.status(201).json({ user: userData });
      } else {
         res.status(400).send("User not found");
      }
   } catch (error) {
      res.status(400).send("Error: " + error);
   }
}

const logoutUser = async (req, res) => {
   try {
      res.cookie('jwt', '', { maxAge: 0 });
      res.status(201).send({ message: "User logged out" });
   } catch (error) {
      console.log(error)
   }
}

const getUserInfo = async (req, res) => {
   try {
      const cookie = req.cookies['jwt'];
      const claims = jwt.verify(cookie, process.env.SECRET);
      if (!claims) {
         res.status(401).send("Unauthenticated user");
      }
      const user = await User.findByPk(claims.id);
      const { password, ...userData } = user.dataValues
      res.status(201).send(userData);
   } catch (error) {
      console.log(error)
      res.status(401).send("Unauthenticated user");
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

const checkAdmin = async (req, res, next) => {
   res.status(201).send({ isAdmin: true });
}

module.exports = { createUser, loginUser, updateUser, getUserInfo, logoutUser, checkAdmin }