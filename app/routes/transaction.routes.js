module.exports = (app) => {
  const transaction = require("../controllers/transaction.controller.js");

  // get ItemList in Cart
  app.post("/api/transaction", transaction.createNewTransaction);
  app.get("/api/getTransaction", transaction.getFreeTransID);
  app.get("/api/getAllReceipts/:cust_no", transaction.getAllReceipts);
  app.get("/api/admin/getAllReceipts", transaction.getAdminAllReceipts);

  app.get("/api/checkPayment/:receipt_id", transaction.checkPayment);
  // Update Admin Roles
  app.put("/api/admin/receipt/update/:receipt_id/:status", transaction.updateReceipt);
};
