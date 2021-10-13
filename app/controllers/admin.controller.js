const {Admin,Roles} = require("../models/admin.model.js");

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
  // Create a Admin
  const admin = new Admin({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 8),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    role_id: req.body.role_id,
  });

  // Save Admin in the database
  Admin.create(admin, (err, data) => {
    if (err) {
      if (err.kind === "duplicated") {
        return res.status(400).send({
        message:
           "ชื่อผู้ใช้งานหรืออีเมลล์ถูกใช้ไปแแล้ว.",
      });
      }
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Admin.",
      });
    } else res.send(data);
  });
};

// Find a single Admin
exports.signin = (req, res) => {
  Admin.findUsernameToLogin(req.body, (err, data) => {
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
      var token = jwt.sign({ id: Admin.username }, config.secret, {
        expiresIn: 86400, // 24 hours
      });
      return res.status(200).send({
        username: req.body.username,
        accessToken: token,
      });
    }
  });
};

exports.findAllRoles = (req, res) => {
  Roles.getAllRoles((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Admin Roles."
      });
    else res.send(data);
  });
};

exports.getAdminAccounts = (req, res) => {
  Admin.getAdminAccounts((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Admin Roles."
      });
    else res.send(data);
  });
};

exports.deleteAdminAccounts = (req, res) => {
  Admin.deleteAdminAccounts(req.params.admin_id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Customer with id ${req.params.admin_id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Customer with id " + req.params.admin_id
        });
      }
    } else res.send({ message: `Customer was deleted successfully!` });
  });
};