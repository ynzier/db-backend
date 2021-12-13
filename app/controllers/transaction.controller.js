const { Transaction } = require("../models/transaction.model.js");

exports.createNewTransaction = async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  if (req.body.data != null) req.body = req.body;

  await Transaction.createNewTransaction(req.body, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Admin Roles.",
      });
    else res.send(data);
  });
};

exports.getFreeTransID = async (req, res) => {
  await Transaction.getFreeTransID((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Admin Roles.",
      });
    else return res.status(200).send(data);
  });
};

exports.getAllReceipts = (req, res) => {
  Transaction.getAllReceipts(req.params.cust_no, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Admin Roles.",
      });
    else res.send(data);
  });
};
exports.getAdminAllReceipts = (req, res) => {
  Transaction.getAdminAllReceipts((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Admin Roles.",
      });
    else res.send(data);
  });
};
exports.checkPayment = (req, res) => {
  Transaction.checkPayment(req.params.receipt_id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Admin Roles.",
      });
    else res.send(data);
  });
};

exports.updateReceipt = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  Transaction.updateReceipt(req.params.receipt_id, req.params.status, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Customer with id .`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Customer with id ",
        });
      }
    } else res.send(data);
  });
};
