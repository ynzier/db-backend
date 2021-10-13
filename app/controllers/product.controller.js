const { Product, ProductType, Brand } = require("../models/product.model.js");

exports.addnew = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  if (req.body.data != null) req.body = req.body.data;
  // Create a Customer
  const product = new Product({
    prod_type: req.body.prod_type,
    prod_name: req.body.prod_name,
    description: req.body.description,
    price: req.body.price,
    stock: req.body.stock,
    image: req.body.image,
    brand_id: req.body.brand_id,
  });

  // Save Customer in the database
  Product.create(product, (err, data) => {
    if (err) {
      if (err.kind === "duplicated") {
        return res.status(400).send({
          message: "ชื่อผู้ใช้งานหรืออีเมลล์ถูกใช้ไปแแล้ว.",
        });
      }
      return res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Customer.",
      });
    } else res.send(data);
  });
};

exports.getAll = (req, res) => {
  Product.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Admin Roles.",
      });
    else res.send(data);
  });
};
exports.getOne = (req, res) => {
  Product.getOne(req.params.prod_id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Admin Roles.",
      });
    else res.send(data);
  });
};
exports.getAllTypes = (req, res) => {
  ProductType.getAllTypes((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Admin Roles.",
      });
    else res.send(data);
  });
};

exports.addBrand = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  if (req.body.data != null) req.body = req.body.data;
  // Create a Customer
  const brand = new Brand({
    name: req.body.name,
  });

  // Save Customer in the database
  Brand.addnew(brand, (err, data) => {
    if (err) {
      if (err.kind === "duplicated") {
        return res.status(400).send({
          message: "ชื่อผู้ใช้งานหรืออีเมลล์ถูกใช้ไปแแล้ว.",
        });
      }
      return res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Customer.",
      });
    } else res.send(data);
  });
};

exports.getAllBrands = (req, res) => {
  Brand.getAllBrands((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Admin Roles.",
      });
    else res.send(data);
  });
};
exports.deleteProduct = (req, res) => {
  Product.deleteProduct(req.params.prod_id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Product with id ${req.params.prod_id}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete Customer with id " + req.params.prod_id,
        });
      }
    } else res.send({ message: `Customer was deleted successfully!` });
  });
};

exports.updateProduct = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  Product.updateById(
    req.params.prod_id,
    new Product(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Customer with id ${req.params.customerId}.`,
          });
        } else {
          res.status(500).send({
            message: "Error updating Customer with id " + req.params.customerId,
          });
        }
      } else res.send(data);
    }
  );
};
