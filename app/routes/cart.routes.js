module.exports = (app) => {
  const carts = require("../controllers/cart.controller.js");

  // get ItemList in Cart
  app.get("/api/getCart/:cust_no", carts.getCart);
  // add Item to Cart
  app.post("/api/addItemToCart/:cust_no/:prod_id", carts.addItem);
  // Delete Item from Cart
  app.delete("/api/deleteFromCart/:cust_no/:prod_id", carts.deleteItem);
};
