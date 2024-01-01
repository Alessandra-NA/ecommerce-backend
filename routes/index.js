const { Router } = require('express');
const { createUser, updateUser } = require('../controllers/user.controller');
const { addProductCart, deleteProductCart, getCartInfo } = require('../controllers/shoppingcart.controller');
const { createProduct, getProductInfo, updateProductInfo, deleteProduct, getSaleProducts  } = require('../controllers/product.controller');


const router = Router();  

router.get('/', (req, res) => {
  res.send('Hello World!');
})

router.get('/user/create', createUser)
router.get('/user/update', updateUser)

router.get('/cart/addProduct', addProductCart)
router.get('/cart/deleteProduct', deleteProductCart)
router.get('/cart/get', getCartInfo)

router.get('/product/create', createProduct)
router.get('/product/get', getProductInfo)
router.get('/product/update', updateProductInfo)
router.get('/product/delete', deleteProduct)
router.get('/product/getSale', getSaleProducts)

module.exports = router;