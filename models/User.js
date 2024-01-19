'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class User extends Model {
   static associate({ ShoppingCart }) {
      this.hasOne(ShoppingCart, { foreignKey: 'userId' });
   }
}

User.init({
  email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM,
    values: ['admin', 'user'],
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'User',
  freezeTableName: true
});

module.exports = { User };