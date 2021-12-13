const sql = require("./db.js");

// constructor
const Cart = function (cart) {
  this.cust_no = cart.cust_no;
  this.prod_id = cart.prod_id;
  this.quantity = cart.quantity;
};

Cart.getCart = (id, result) => {
  sql.query(
    "SELECT carts.cust_no, carts.prod_id, p.description, p.prod_name, p.price, p.image, p.stock, carts.quantity FROM carts JOIN products as p ON carts.prod_id = p.prod_id WHERE cust_no = '" +
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

Cart.addItem = async (cart, result) => {
  sql.query("INSERT INTO carts SET ?", cart, (err, res) => {
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

    result(null, { ...cart });
  });
};

Cart.deleteItem = (cust_no, prod_id, result) => {
  sql.query(
    "DELETE FROM carts WHERE cust_no = '" +
      cust_no +
      "' AND prod_id ='" +
      prod_id +
      "'",
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

Cart.getTransaction = (id, result) => {
  sql.query(
    "SELECT transactions.transaction_id, transactions.prod_id, p.prod_name,p.price, transactions.quantity FROM transactions JOIN products as p ON transactions.prod_id = p.prod_id WHERE transaction_id = '" +
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
Cart.getReceipt = (id, result) => {
  sql.query(
    "SELECT receipts.receipt_id, receipts.transaction_id, receipts.cust_no, c.firstName, c.lastName, c.email, c.phone, c.shipping_addr, transactions.prod_id, p.prod_name,p.price, transactions.quantity FROM receipts JOIN transactions ON receipts.transaction_id = transactions.transaction_id JOIN products as p ON transactions.prod_id = p.prod_id JOIN customers as c ON transactions.cust_no = c.cust_no WHERE receipt_id = '" +
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
module.exports = { Cart };
