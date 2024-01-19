const { User } = require("../models");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();

const authAdmin = async (req, res, next) => {
   try {
      const cookie = req.cookies['jwt'];
      const claims = jwt.verify(cookie, process.env.SECRET);
      if (!claims) {
         res.status(401).send("Unauthenticated user");
      }
      const user = await User.findByPk(claims.id);
      if (user.role === 'admin') {
         next()
      } else {
         res.status(401).send("Unauthenticated user");
      }
   } catch (error) {
      console.log(error)
      res.status(401).send("Unauthenticated user");
   }
}

module.exports = { authAdmin }