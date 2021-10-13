const sql = require("./db.js");

// constructor
const Product = function (product) {
  this.prod_type = product.prod_type;
  this.prod_name = product.prod_name;
  this.description = product.description;
  this.price = product.price;
  this.stock = product.stock;
  this.image = product.image;
  this.brand_id = product.brand_id;
};
const ProductType = function (type) {
  this.prod_type = type.prod_type;
  this.category = type.category;
};
const Brand = function (brand) {
  this.id = brand.id;
  this.name = brand.name;
};

Product.create = async (product, result) => {
  sql.query("INSERT INTO products SET ?", product, (err, res) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        result({ kind: "duplicated" }, null);
        return;
      } else {
        console.log("error: ", err);
        result(err, null);
        return;
      }
    }

    result(null, { prod_id: res.insertId, ...product });
  });
};
Product.getOne = (id, result) => {
  sql.query(
    "SELECT * FROM products WHERE prod_id = '" + id + "'",
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        result(null, res[0]);
        return;
      }
      result({ kind: "not_found" }, null);
    }
  );
};
Product.getAll = (result) => {
  sql.query(
    "SELECT products.prod_id ,products.description,products.prod_name,products.price,products.image,products.stock, product_types.category,brands.name FROM products INNER JOIN product_types ON products.prod_type = product_types.prod_type INNER JOIN brands ON products.brand_id = brands.id;",
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      result(null, res);
    }
  );
};

ProductType.getAllTypes = (result) => {
  sql.query("SELECT * FROM product_types", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};

Brand.addnew = async (newBrand, result) => {
  sql.query("INSERT INTO brands SET ?", newBrand, (err, res) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        result({ kind: "duplicated" }, null);
        return;
      } else {
        console.log("error: ", err);
        result(err, null);
        return;
      }
    }
    result(null, { id: res.insertId, ...newBrand });
  });
};

Brand.getAllBrands = (result) => {
  sql.query("SELECT * FROM brands", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};

Product.deleteProduct = (id, result) => {
  sql.query("DELETE FROM products WHERE prod_id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Customer with the id
      result({ kind: "not_found" }, null);
      return;
    }

    result(null, res);
  });
};

Product.updateById = (id, product, result) => {
  sql.query(
    "UPDATE products SET ? WHERE prod_id = '" + id + "'",
    product,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Customer with the id
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, { id: id, ...product });
    }
  );
};

module.exports = { Product, Brand, ProductType };
