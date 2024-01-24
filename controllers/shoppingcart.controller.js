const { ShoppingCart, ShoppingCartProduct, Product } = require("../models"); 
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');

dotenv.config();

const getCart = async (req, res) => {
   try {
      const cookie = req.cookies['jwt'];
      const claims = jwt.verify(cookie, process.env.SECRET);
      if (!claims) {
         res.status(401).send("Unauthenticated user");
      }
      var shoppingCart = await ShoppingCart.findOne({
         where: { userId: claims.id },
         include: { model: Product, as: 'products' }
      });
      res.status(201).json(shoppingCart);
   } catch (error) {
      res.status(400).send("Could not retrieve info from cart: " + error);
   }
}
const addProductCart = async (req, res) => {
   const { productId, quantity } = req.body;
   if (quantity <= 0) {
      res.status(400).send("Quantity must be greater than 0");
      return
   }
   try {
      const cookie = req.cookies['jwt'];
      const claims = jwt.verify(cookie, process.env.SECRET);
      if (!claims) {
         res.status(401).send("Unauthenticated user");
      }
      var shoppingCart = await ShoppingCart.findOne({
         where: { userId: claims.id },
         include: {model: Product, as: 'products'}
      });
      const productInCart = await ShoppingCartProduct.findOne({
         where: {
            productId,
            cartId: shoppingCart.id
         }
      });
      // if item is already on cart
      if (productInCart) {
         productInCart.quantity += Number(quantity);
         await productInCart.save();
      } else { // if item is new in cart
         console.log(productId, quantity, shoppingCart.id)
         await ShoppingCartProduct.create({ productId, quantity, cartId: shoppingCart.id });
      }
      shoppingCart = await updateSubTotal(shoppingCart, productId, quantity, 'add');
      res.status(201).json(shoppingCart);
   } catch (error) {
      console.log(error)
      res.status(400).send("Product could not be added to cart: " + error);
   }
}
const deleteProductCart = async (req, res) => {
   var { productId, quantity } = req.body;
   if (quantity <= 0) {
      res.status(400).send("Quantity must be greater than 0");
      return
   }
   try {
      const cookie = req.cookies['jwt'];
      const claims = jwt.verify(cookie, process.env.SECRET);
      if (!claims) {
         res.status(401).send("Unauthenticated user");
      }
      var shoppingCart = await ShoppingCart.findOne({
         where: { userId: claims.id },
         include: { model: Product, as: 'products' }
      });
      const productInCart = await ShoppingCartProduct.findOne({
         where: {
            productId,
            cartId: shoppingCart.id
         }
      });

      // if all items were deleted fom cart
      if (productInCart.quantity <= quantity) {
         quantity = productInCart.quantity
         await productInCart.destroy();
      } else { // if only some items were deleted from cart
         productInCart.quantity -= quantity;
         await productInCart.save();
      }
      shoppingCart = await updateSubTotal(shoppingCart, productId, quantity, 'delete');
      res.status(201).json(shoppingCart);
   } catch (error) {
      res.status(400).send("Product could not be removed from cart: " + error);
   }
}
const updateQuantityCart = async (req, res) => {
   const cart = req.body.cart
   const cookie = req.cookies['jwt'];
   const claims = jwt.verify(cookie, process.env.SECRET);
   if (!claims) {
      res.status(401).send("Unauthenticated user");
   }
   var savedCart = await ShoppingCart.findOne({ where: { userId: claims.id }, include: { model: Product, as: 'products' } });
   for (const product of cart.products) {
      const savedProd = savedCart.products.find(p => p.id === product.id);

      if (savedProd.ShoppingCartProduct.quantity !== product.ShoppingCartProduct.quantity) {
         if (product.ShoppingCartProduct.quantity > 0) {
            await savedProd.ShoppingCartProduct.update({ quantity: product.ShoppingCartProduct.quantity })
         } else if (product.ShoppingCartProduct.quantity === 0) {
            await savedProd.ShoppingCartProduct.destroy();
         }
         await savedCart.reload({ include: { model: Product, as: 'products' } });
      }
   }

   res.status(200).send(savedCart);

}

/**
 * Updates the subtotal of a shopping cart based on the specified action.
 *
 * @param {number} shoppingCartId - The ID of the shopping cart.
 * @param {number} productId - The ID of the product.
 * @param {number} quantity - The quantity of the product to add or remove.
 * @param {string} action - The action to perform ('add' or 'remove').
 * @return {Object} The updated shopping cart object.
 */
async function updateSubTotal(shoppingCart, productId, quantity, action) {
   const product = await Product.findByPk(productId);
   if (action === 'add') shoppingCart.subtotal += product.price * quantity;
   else shoppingCart.subtotal -= product.price * quantity;
   await shoppingCart.save();
   await shoppingCart.reload({ include: { model: Product, as: 'products' } });
   return shoppingCart;
}

// TODO: Placing order



module.exports = { addProductCart, deleteProductCart, getCart, updateQuantityCart }