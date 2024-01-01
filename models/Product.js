'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Product extends Model { 
   static associate({ ShoppingCart }) {
      this.belongsToMany(ShoppingCart, { through: 'ShoppingCartProduct', foreignKey: 'productId' });
   }
}

Product.init({
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	price: {
		type: DataTypes.FLOAT, 
		allowNull: false
	},
	discountPrice: {
		type: DataTypes.FLOAT,
		allowNull: true
   },
   category: {
      type: DataTypes.STRING,
      allowNull: false
   },
	images: {
		type: DataTypes.JSON,
		allowNull: false
   },
   numberInStock: {
      type: DataTypes.INTEGER,
      allowNull: false
   },
   active: {
      type: DataTypes.BOOLEAN,
      allowNull: false
   },
   rating: {
      type: DataTypes.FLOAT,
      allowNull: true
   },
   tags: {
      type: DataTypes.JSON,
      allowNull: true
   },
   brand: {
      type: DataTypes.STRING,
      allowNull: true
	},
	description: {
		type: DataTypes.STRING,
		allowNull: true
	},
	SKU: {
		type: DataTypes.STRING,
		allowNull: true
	}
}, {
	sequelize,
	modelName: 'Product',
	freezeTableName: true
})

module.exports = { Product };