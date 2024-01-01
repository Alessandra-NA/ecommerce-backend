const { Op } = require("sequelize")
const { Product, User } = require("../models")

const createProduct = async (req, res) => {
   try {
      const product = await Product.create(req.body)
      res.status(201).json(product)
   } catch (error) {
      res.status(400).send("Product not created: " + error)
   }
}
const getProductInfo = async (req, res) => {
   try {
      const product = await Product.findByPk(req.body.productId)
      res.status(201).json(product)
   } catch (error) {
      res.status(400).send("Product not found: " + error)
   }   
}
const updateProductInfo = async (req, res) => {
   try {
      const product = await Product.update(req.body, {
         where: { id: req.body.productId },
         returning: true
      })
      res.status(201).json(product)
   } catch (error) {
      res.status(400).send("Product not updated: " + error)
   }
}
const deleteProduct = async (req, res) => {
   try {
      await Product.destroy({ where: { id: req.body.productId } })
      res.status(201)
   } catch (error) {
      res.status(400).send("Error deleting product: " + error)
   }
}
const getSaleProducts = async (req, res) => {
   try {
      const saleProducts = await Product.findAll({
         where: {
            discoutPrice : { [Op.not]: 0 }
         }
      })
      res.status(201).json(saleProducts)
   } catch (error) {
      res.status(400).send("Error getting sale products: " + error)
   }
}
const addCustomerFeedback = async (req, res) => {
   // TODO: Add customer feedback
}

function recalculateSubtotal(products) {
   // TODO: update all cart subtotals
}


module.exports = { createProduct, getProductInfo, updateProductInfo, deleteProduct, getSaleProducts }