module.exports = (app) => {
  const admin = require("../controllers/admin.controller.js");

  // Create a new Customer
  app.post("/api/admin/auth/signup", admin.signup);

  // Retrieve a single Customer with customerId
  app.post("/api/admin/auth/signin", admin.signin);

  // Retrieve Admin Roles
  app.get("/api/admin/getAdminRoles", admin.findAllRoles);

  // Retrieve Admin Roles
  app.get("/api/admin/getAdminAccounts", admin.getAdminAccounts);
  // Retrieve Admin Roles
  app.get("/api/admin/deleteAdminAccount/:admin_id", admin.deleteAdminAccounts);
};
