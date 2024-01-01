const { ShoppingCart, ShoppingCartProduct, Product } = require("../models"); 

const getCartInfo = async (req, res) => {
   const { shoppingCartId } = req.body;
   try {
      // TODO: Check
      const shoppingCart = await ShoppingCart.findByPk(shoppingCartId, {
         include: [
            {
               model: Product,
               through: { attributes: ['quantity'] }
            },
         ],
      })
      const products = shoppingCart.products
      const cartInfo = {
         subtotal: shoppingCart.subtotal,
         products: products.map((product) => ({
            id: product.id,
            name: product.name, 
            quantity: product.ShoppingCartProduct.quantity,
         }))
      }
      res.json(cartInfo);
   } catch (error) {
      res.status(400).send("Could not retrieve info from cart: ", error);
   }
}
const addProductCart = async (req, res) => {
   const { productId, quantity, shoppingCartId } = req.body;
   try {
      const productInCart = await ShoppingCartProduct.findOne({ where: { productId, shoppingCartId } });
      // if item is already on cart
      if (productInCart) {
         productInCart.quantity += quantity;
         await productInCart.save();
      } else { // if item is new in cart
         await ShoppingCartProduct.create({ productId, quantity, shoppingCartId });
      }
      const shoppingCart = await updateSubTotal(shoppingCartId, productId, quantity, 'add');
      res.status(201).json(shoppingCart);
   } catch (error) {
      res.status(400).send("Product could not be added to cart: ", error);
   }
}

const deleteProductCart = async (req, res) => {
   const { productId, quantity, shoppingCartId } = req.body;
   try {
      const productInCart = await ShoppingCartProduct.findOne({ where: { productId, shoppingCartId } });
      // if all items were deleted fom cart
      if (productInCart.quantity <= quantity) {
         await productInCart.destroy();
      } else { // if only some items were deleted from cart
         productInCart.quantity -= quantity;
         await productInCart.save();
      }
      const shoppingCart = await updateSubTotal(shoppingCartId, productId, quantity, 'delete');
      res.status(201).json(shoppingCart);
   } catch (error) {
      res.status(400).send("Product could not be removed from cart: ", error);
   }
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
async function updateSubTotal(shoppingCartId, productId, quantity, action) {
   var shoppingCart = await ShoppingCart.findByPk(shoppingCartId);
   const product = await Product.findByPk(productId);
   if (action === 'add') shoppingCart.subtotal += product.price * quantity;
   else shoppingCart.subtotal -= product.price * quantity;
   await shoppingCart.save();
   return shoppingCart;
}

// TODO: Placing order



module.exports = { addProductCart, deleteProductCart, getCartInfo }