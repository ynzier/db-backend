const sql = require("./db.js");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const config = require("../config/auth.config.js");
// constructor
const Customer = function (customer) {
  this.username = customer.username;
  this.password = customer.password;
  this.firstName = customer.firstName;
  this.lastName = customer.lastName;
  this.birth_date = customer.birth_date;
  this.email = customer.email;
  this.phone = customer.phone;
  this.billing_addr = customer.billing_addr;
  this.shipping_addr = customer.shipping_addr;
};

Customer.create = async (newCustomer, result) => {
  sql.query("INSERT INTO customers SET ?", newCustomer, (err, res) => {
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

    console.log("created customer: ", {
      cust_no: res.insertId,
      ...newCustomer,
    });
    result(null, { id: res.insertId, ...newCustomer });
  });
};
Customer.getCustomerDetail = (id, result) => {
  sql.query(
    "SELECT * FROM customers WHERE cust_no = '" + id + "'",
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        result(null, res[0]);
        return;
      }
      result({ kind: "not_found" }, null);
    }
  );
};
Customer.findUsernameToLogin = (data, result) => {
  sql.query(
    "SELECT * FROM customers WHERE username = '" + data.username + "'",
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log(res[0].username);

        var passwordIsValid = bcrypt.compareSync(
          data.password,
          res[0].password
        );

        if (!passwordIsValid) {
          result({ kind: "not_match" }, null);
        }

        result(null, res[0]);
        return;
      }

      result({ kind: "not_found" }, null);
    }
  );
};

Customer.getCustomerAccounts = (result) => {
  sql.query(
    "SELECT cust_no,username,firstName,lastName,email  FROM customers",
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

Customer.deleteCustomerAccount = (id, result) => {
  sql.query("DELETE FROM customers WHERE cust_no = ?", id, (err, res) => {
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
  });
};
Customer.update = (id, data, result) => {
  sql.query(
    "UPDATE customers SET firstName = '" +
      data.firstName +
      "' ,lastName = '" +
      data.lastName +
      "',email = '" +
      data.email +
      "',shipping_addr = '" +
      data.shipping_addr +
      "',billing_addr = '" +
      data.billing_addr +
      "' ,phone = '" +
      data.phone +
      "' WHERE cust_no = '" +
      id +
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
module.exports = Customer;
