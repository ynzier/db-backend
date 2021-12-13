const sql = require("./db.js");

// constructor
const Transaction = function (transaction) {
  this.transaction_id = transaction.transaction_id;
  this.cust_no = transaction.cust_no;
  this.prod_id = transaction.prod_id;
  this.quantity = transaction.quantity;
};

Transaction.getFreeTransID = async (result) => {
  var freeTransactionID;
  await sql.query(
    "SELECT MAX(transaction_id) as maxItem FROM transactions",
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      res[0].maxItem = res[0].maxItem + 1;
      result(null, res[0]);
    }
  );
};

Transaction.createNewTransaction = async (data, result) => {
  var list = data.data;
  await sql.query(
    "INSERT INTO transactions (transaction_id,cust_no,prod_id,quantity) VALUES ?",
    [list],
    (err, res) => {
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
    }
  );
  await sql.query(
    "INSERT INTO receipts (cust_no,transaction_id,total,status) VALUES (" +
      list[0][1] +
      "," +
      list[0][0] +
      "," +
      data.total +
      ",0)",
    (err, res) => {
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
    }
  );

  await sql.query(
    "DELETE FROM carts WHERE cust_no = " + list[0][1] + "",
    (err, res) => {
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
    }
  );
};

Transaction.getAllReceipts = (id, result) => {
  sql.query(
    "SELECT * FROM receipts WHERE cust_no = '" + id + "'",
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

Transaction.getAdminAllReceipts = (result) => {
  sql.query("SELECT * FROM receipts ", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};
Transaction.checkPayment = (id, result) => {
  sql.query(
    "UPDATE receipts SET status='1' WHERE receipt_id = '" + id + "'",
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

      result(null, res);
    }
  );
};

Transaction.updateReceipt = (id, status, result) => {
  sql.query(
    "UPDATE receipts SET status = " +
      status +
      " WHERE receipt_id = '" +
      id +
      "'",
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

module.exports = { Transaction };
