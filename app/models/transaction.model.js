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
  console.log(data);
  await sql.query(
    "INSERT INTO transactions (transaction_id,cust_no,prod_id,quantity) VALUES ?",
    [data],
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

module.exports = { Transaction };
