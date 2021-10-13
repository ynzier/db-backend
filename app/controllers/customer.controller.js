const Customer = require("../models/customer.model.js");

const config = require("../config/auth.config.js");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  if (req.body.data != null) req.body = req.body.data;
  // Create a Customer
  const customer = new Customer({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 8),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    birth_date: req.body.birth_date,
    email: req.body.email,
    phone: req.body.phone,
    billing_addr: req.body.billing_addr,
    shipping_addr: req.body.shipping_addr,
  });

  // Save Customer in the database
  Customer.create(customer, (err, data) => {
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

// Find a single Customer with a customerId
exports.signin = (req, res) => {
  Customer.findUsernameToLogin(req.body, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).send({
          message: `ไม่พบผู้ใช้งาน!`,
        });
      }
      if (err.kind === "not_match") {
        return res.status(401).send({
          accessToken: null,
          message: "รหัสผ่านผิด!",
        });
      } else {
        return res.status(500).send({
          message: "Error 500 with username: " + req.body.username,
        });
      }
    } else {
      var token = jwt.sign({ id: Customer.username }, config.secret, {
        expiresIn: 86400, // 24 hours
      });
      return res.status(200).send({
        username: req.body.username,
        accessToken: token,
        custNo: data.cust_no,
      });
    }
  });
};
exports.getCustomerDetail = (req, res) => {
  Customer.getCustomerDetail(req.params.cust_no, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Admin Roles.",
      });
    else res.send(data);
  });
};
exports.getCustomerAccounts = (req, res) => {
  Customer.getCustomerAccounts((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Admin Roles.",
      });
    else res.send(data);
  });
};
exports.getCustNo = (req, res) => {
  Customer.getCustNo(req.body, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Admin Roles.",
      });
    else res.send(data);
  });
};

exports.deleteCustomerAccount = (req, res) => {
  Customer.deleteCustomerAccount(req.params.cust_no, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Customer with id ${req.params.cust_no}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete Customer with id " + req.params.cust_no,
        });
      }
    } else res.send({ message: `Customer was deleted successfully!` });
  });
};

exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  Customer.update(req.params.cust_no, new Customer(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Customer with id ${req.params.cust_no}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Customer with id " + req.params.cust_no,
        });
      }
    } else res.send(data);
  });
};
