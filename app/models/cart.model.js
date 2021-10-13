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
module.exports = { Cart };
