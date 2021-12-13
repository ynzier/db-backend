const { Cart } = require("../models/cart.model.js");

exports.getCart = (req, res) => {
  Cart.getCart(req.params.cust_no, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Admin Roles.",
      });
    else res.send(data);
  });
};
exports.addItem = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  if (req.body.data != null) req.body = req.body.data;
  // Create a Customer
  const cart = new Cart({
    cart_id: req.params.cart_id,
    cust_no: req.params.cust_no,
    prod_id: req.params.prod_id,
    quantity: req.body.quantity,
  });

  // Save Customer in the database
  Cart.addItem(cart, (err, data) => {
    if (err) {
      if (err.kind === "duplicated") {
        return res.status(400).send({
          message: "สินค้านี้มีอยู่ในตะกร้าแล้ว",
        });
      }
      return res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Customer.",
      });
    } else res.send(data);
  });
};

exports.deleteItem = (req, res) => {
  Cart.deleteItem(req.params.cust_no, req.params.prod_id, (err, data) => {
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

exports.getTransaction = (req, res) => {
  Cart.getTransaction(req.params.transaction_id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Admin Roles.",
      });
    else res.send(data);
  });
};
exports.getReceipt = (req, res) => {
  Cart.getReceipt(req.params.transaction_id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Admin Roles.",
      });
    else res.send(data);
  });
};