module.exports = (app) => {
  const transaction = require("../controllers/transaction.controller.js");

  // get ItemList in Cart
  app.post("/api/transaction", transaction.createNewTransaction);
  app.get("/api/getTransaction", transaction.getFreeTransID);
};
