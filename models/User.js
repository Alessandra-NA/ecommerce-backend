'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class User extends Model {
   static associate({ ShoppingCart }) {
      this.hasOne(ShoppingCart, { foreignKey: 'userId' });
   }
}

User.init({
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
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