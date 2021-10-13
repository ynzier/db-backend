module.exports = (app) => {
  const customers = require("../controllers/customer.controller.js");

  // Create a new admin
  app.post("/api/auth/signup", customers.signup);

  // Retrieve a single admin
  app.get("/api/getCustomer/:cust_no", customers.getCustomerDetail);
  // Update Admin Roles
  app.put("/api/updateCustomer/:cust_no", customers.update);
  // Retrieve a single admin
  app.post("/api/auth/signin", customers.signin);

  // Retrieve Admin Roles
  app.get("/api/admin/getAllCustomer", customers.getCustomerAccounts);
  // Retrieve Admin Roles
  app.get(
    "/api/admin/deleteCustomer/:cust_no",
    customers.deleteCustomerAccount
  );
};
