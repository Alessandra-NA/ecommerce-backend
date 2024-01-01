'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class ShoppingCartProduct extends Model {
}

ShoppingCartProduct.init({
   quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
   }
}, {
   sequelize,
   modelName: 'ShoppingCartProduct',
   freezeTableName: true
});


module.exports = { ShoppingCartProduct };