'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class ShoppingCart extends Model {
   static associate({ Product, User }) {
      this.belongsToMany(Product, { as: 'products', through: 'ShoppingCartProduct', foreignKey: 'cartId' });
      this.belongsTo(User, { as: 'user', foreignKey: 'userId' });
   }
}

ShoppingCart.init({
   subtotal: {
      type: DataTypes.FLOAT,
      allowNull: false
   }, 
   shippingFee: {
      type: DataTypes.FLOAT,
      allowNull: false
   },
   total: {
      type: DataTypes.FLOAT,
      allowNull: false
   },
   paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false
   }
   }, {
   sequelize,
   modelName: 'ShoppingCart',
   freezeTableName: true
});

module.exports = { ShoppingCart };