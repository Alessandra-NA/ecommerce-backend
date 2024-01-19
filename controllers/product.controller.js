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
      const product = await Product.findByPk(req.params.productId)
      res.status(201).json(product)
   } catch (error) {
      res.status(400).send("Product not found: " + error)
   }   
}
const updateProductInfo = async (req, res) => {
   try {
      const product = await Product.findByPk(req.body.productId)
      product.update(req.body)
      await product.save()
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

const getCategoryProducts = async (req, res) => {
   try {
      const categoryProducts = await Product.findAll({
         where: {
            category: req.params.category
         }
      })
      res.status(201).json(categoryProducts)
   } catch (error) {
      res.status(400).send("Error getting category products: " + error)
   }
}

const getFeaturedProducts = async (req, res) => {
   try {
      const featuredProducts = await Product.findAll()
      res.status(201).json(featuredProducts.slice(0, 4))
   } catch (error) {
      res.status(400).send("Error getting featured products: " + error)
   }
}
const addCustomerFeedback = async (req, res) => {
   // TODO: Add customer feedback
}

function recalculateSubtotal(products) {
   // TODO: update all cart subtotals
}


module.exports = { createProduct, getProductInfo, updateProductInfo, deleteProduct, getSaleProducts, getCategoryProducts, getFeaturedProducts }