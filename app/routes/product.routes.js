module.exports = (app) => {
  const products = require("../controllers/product.controller.js");

  // Create a new admin
  app.post("/api/admin/product/add", products.addnew);

  // Retrieve a single admin
  app.get("/api/admin/product/getOne/:prod_id", products.getOne);
  // Retrieve a single admin
  app.get("/api/admin/product/getAll", products.getAll);


  // Retrieve Admin Roles
  app.get("/api/admin/product/getAllProductType", products.getAllTypes);
  // Retrieve Admin Roles
  app.post("/api/admin/product/addProductType", products.addProductType);
  // Retrieve Admin Roles
  app.delete("/api/admin/product/deleteProductType/:type", products.deleteProductType);


  // Retrieve Admin Roles
  app.get("/api/admin/product/getAllBrands", products.getAllBrands);
  // Retrieve Admin Roles
  app.post("/api/admin/product/addBrand", products.addBrand);
  // Retrieve Admin Roles
  app.delete("/api/admin/product/deleteBrand/:brand", products.deleteBrand);


  // Update Admin Roles
  app.put("/api/admin/product/update/:prod_id", products.updateProduct);
  // Retrieve Admin Roles
  app.delete(
    "/api/admin/product/deleteProduct/:prod_id",
    products.deleteProduct
  );
  // Update Admin Roles
  app.put("/api/updateStock", products.updateStock);
};
