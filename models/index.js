const sequelize = require('../db');

const db = {
  Sequelize: sequelize,
  sequelize,
   ...require('./Product.js'),
   ...require('./ShoppingCart.js'),
   ...require('./ShoppingCartProduct.js'),
   ...require('./User.js'),
};

Object.keys(db).forEach(modelName => {
   if (db[modelName].associate) {
      db[modelName].associate(db);
   }
});


module.exports = {
  ...db,
};