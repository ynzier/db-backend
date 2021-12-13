module.exports = (app) => {
  const carts = require("../controllers/cart.controller.js");

  // get ItemList in Cart
  app.get("/api/getCart/:cust_no", carts.getCart);
  // get ItemList in Cart
  app.get("/api/getTransaction/:transaction_id", carts.getTransaction);
  // add Item to Cart
  app.post("/api/addItemToCart/:cust_no/:prod_id", carts.addItem);
  // Delete Item from Cart
  app.delete("/api/deleteFromCart/:cust_no/:prod_id", carts.deleteItem);
  // get ItemList in Cart
  app.get("/api/admin/getTransaction/:transaction_id", carts.getReceipt);
};
