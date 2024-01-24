const { Router } = require('express');
const { createUser, loginUser, logoutUser, updateUser, getUserInfo, checkAdmin } = require('../controllers/user.controller');
const { addProductCart, deleteProductCart, getCart, updateQuantityCart } = require('../controllers/shoppingcart.controller');
const { createProduct, getProductInfo, updateProductInfo, deleteProduct, getSaleProducts, getCategoryProducts, getFeaturedProducts, filterProducts } = require('../controllers/product.controller');
const { authAdmin } = require('../middlewares/auth');


const router = Router();  

router.get('/', (req, res) => {
  res.send('Hello World!');
})

router.get('/user', getUserInfo)
router.post('/user/create', createUser)
router.post('/user/update', updateUser)
router.post('/user/login', loginUser)
router.get('/user/logout', logoutUser)
router.get('/user/checkAdmin', authAdmin, checkAdmin)

router.post('/cart/addProduct', addProductCart)
router.post('/cart/deleteProduct', deleteProductCart)
router.get('/cart', getCart)
router.post('/cart/updateQuantity', updateQuantityCart)

router.post('/product/create', authAdmin, createProduct)
router.get('/product/get/:productId', getProductInfo)
router.post('/product/update', authAdmin, updateProductInfo)
router.post('/product/delete', authAdmin, deleteProduct)
router.get('/product/getSale', getSaleProducts)
router.get('/product/category/:category', getCategoryProducts)
router.get('/product/featured', getFeaturedProducts)
router.post('/product/filter', filterProducts)

module.exports = router;