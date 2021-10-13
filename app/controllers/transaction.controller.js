const { Transaction } = require("../models/transaction.model.js");

exports.createNewTransaction = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  if (req.body.data != null) req.body = req.body.data;

  Transaction.createNewTransaction(req.body, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Admin Roles.",
      });
    else res.send(data);
  });
};

exports.getFreeTransID = (req, res) => {
  Transaction.getFreeTransID((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Admin Roles.",
      });
    else return res.status(200).send(data);
  });
};
