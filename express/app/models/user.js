'use strict';

const bcrypt = require('bcrypt');
const Knex = require("knex")({
  client: "pg",
  connection: {
    host: "localhost",
    user: "pi",
    password: "password",
    database: "homestatus"
  }
});
const bookshelf = require("bookshelf")(Knex);

let User = bookshelf.Model.extend({
  tableName: 'users',

  setPassword: function (password) {
    var _this = this;
    return new Promise((resolve, reject) =>
      bcrypt.genSalt(null, (err, salt) =>
          err ? reject(err) : resolve(salt))
    )
    .then((salt) => {
      return new Promise((resolve, reject) =>
        bcrypt.hash(password, salt, (err, data) =>
          err ? reject(err) : resolve(data)))
    })
    .then((digest) => {
      _this.attributes.passwordDigest = digest;
      delete _this.attributes.password;
      return _this;
    });
  },
  comparePassword: function (password) {
    var _this = this;

    return new Promise((resolve, reject) =>
      bcrypt.genSalt(null, (err, salt) =>
          err ? reject(err) : resolve(salt))
    ).then((salt) =>
      new Promise((resolve, reject) =>
        bcrypt.hash(password, salt, (err, data) =>
          err ? reject(err) : resolve(data)))
    ).then((digest) => {
      _this.attributes.passwordDigest = digest;
      return _this;
    });
  },
});

module.exports = User;
