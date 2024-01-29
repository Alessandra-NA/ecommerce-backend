const { Op } = require("sequelize")
const { Product, User } = require("../models")
const { transporter } = require('../config/mailer');


const createProduct = async (req, res) => {
   try {
      const product = await Product.create(req.body)
      notifyByEmail('Product created', 'Product ' + product.name + ' has been created. Details: ' + JSON.stringify(req.body))
      res.status(201).json(product)
   } catch (error) {
      res.status(400).send("Product not created: " + error)
   }
}

const updateProduct = async (req, res) => {
   try {
      const product = await Product.findByPk(req.body.id)
      product.update(req.body)
      notifyByEmail('Product updated', 'Product ' + product.name + ' has been updated. Details: ' + JSON.stringify(req.body))
      await product.save()
      res.status(201).json(product)
   } catch (error) {
      res.status(400).send("Product not updated: " + error)
   }
}
const deleteProduct = async (req, res) => {
   try {
      await Product.destroy({ where: { id: req.body.id } })
      notifyByEmail('Product deleted', 'Product ' + req.body.name + ' has been deleted')
      res.status(201).send({ message: "Product deleted" })
   } catch (error) {
      res.status(400).send("Error deleting product: " + error)
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
      res.status(201).json(featuredProducts.slice(0, 5))
   } catch (error) {
      res.status(400).send("Error getting featured products: " + error)
   }
}

const filterProducts = async (req, res) => {
   // req.body = { minPrice, maxPrice, minRating, category, sortingOrder }
   try {
      if (req.body.sortingOrder === 'Latest') sorting = [['updatedAt', 'DESC']]
      if (req.body.sortingOrder === 'Price - Low to High') sorting = [['price', 'ASC']]
      if (req.body.sortingOrder === 'Price - High to Low') sorting = [['price', 'DESC']]

      if (req.body.category === 'All') {
         var products = await Product.findAll({
            where: {
               price: { [Op.between]: [req.body.minPrice, req.body.maxPrice] },
               rating: { [Op.gte]: req.body.minRating },
            },
            order: sorting
         })
      }
      else {
         var products = await Product.findAll({
            where: {
               category: req.body.category,
               price: { [Op.between]: [req.body.minPrice, req.body.maxPrice] },
               rating: { [Op.gte]: req.body.minRating },
            },
            order: sorting
         })
      }
      res.status(201).send(products)
   } catch (error) {
      res.status(400).send("Error getting filtered products: " + error)
   }
}

const getProductSearch = async (req, res) => {
   // req.body = { searchString }
   try {
      const products = await Product.findAll({
         where: {
            name: {
               [Op.iLike]: `%${req.body.searchString}%`, }
         }
      })
      res.status(201).send(products)
   } catch (error) {
      res.status(400).send("Error getting search products: " + error)
   }
}

const getAllProducts = async (req, res) => {
   try {
      const products = await Product.findAll()
      res.status(201).send(products)
   } catch (error) {
      res.status(400).send("Error getting all products: " + error)
   }
}

const addCustomerFeedback = async (req, res) => {
   // TODO: Add customer feedback
}

function recalculateSubtotal(products) {
   // TODO: update all cart subtotals
}

function notifyByEmail(subject, message) {
   try {
      transporter.sendMail({
         from: '<' + process.env.MAIL_USER + '>',
         to: process.env.MAIL_USER,
         subject: 'E-Commerce: ' + subject,
         html: '<b>' + message + '</b>'
      })
   } catch (error) {
      console.log(error)
   }
}


module.exports = { createProduct, updateProduct, getProductInfo, deleteProduct, getSaleProducts, getCategoryProducts, getFeaturedProducts, filterProducts, getProductSearch, getAllProducts }