const sql = require("./db.js");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const config = require("../config/auth.config.js");
// constructor
const Admin = function (admin) {
  this.username = admin.username;
  this.password = admin.password;
  this.firstName = admin.firstName;
  this.lastName = admin.lastName;
  this.role_id = admin.role_id;
};
const Roles = function (role) {
  this.role_id = role.role_id;
  this.roleName = role.roleName;
};
Admin.create = async (newAdmin, result) => {
  sql.query("INSERT INTO admins SET ?", newAdmin, (err, res) => {
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

    console.log("created admin: ", {
      admin_id: res.insertId,
      ...newAdmin,
    });
    result(null, { admin_id: res.insertId, ...newAdmin });
  });
};

Admin.findUsernameToLogin = (data, result) => {
  sql.query(
    "SELECT * FROM admins WHERE username = '" + data.username + "'",
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
Admin.getAdminAccounts = (result) => {
  sql.query(
    "SELECT admins.admin_id,admins.username,admins.firstName,admins.lastName, admin_role.roleName FROM admins INNER JOIN admin_role ON admins.role_id = admin_role.role_id;",
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
Roles.getAllRoles = (result) => {
  console.log("test");
  sql.query("SELECT * FROM admin_role", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Admin Roles: ", res);
    result(null, res);
  });
};
Admin.deleteAdminAccounts = (id, result) => {
  sql.query("DELETE FROM admins WHERE admin_id = ?", id, (err, res) => {
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
module.exports = { Admin, Roles };
