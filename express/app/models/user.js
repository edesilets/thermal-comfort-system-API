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

exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('users', function(table) {
    table.increments('id').notNullable().primary();
    table.string('email'); // .notNullable().unique();
    table.string('token').unique();
    table.string('passwordDigest').notNullable();
    table.timestamps();
  });
};

exports.up(Knex)
.then(() => {
  console.log('Table created sucessfully');
  //Knex.destroy();
  //console.log("Connection closed..");
});

let User = bookshelf.Model.extend({
  tableName: 'users',
  initialize: function() {
    this.on('creating', this.hashPassword, this);
  },
  hashPassword: function (password) {
    var _this = this;
    return new Promise((resolve, reject) =>
      bcrypt.genSalt(null, (err, salt) =>
          err ? reject(err) : resolve(salt))
    )
    .then((salt) =>
      new Promise((resolve, reject) =>
        bcrypt.hash(password.attributes.password, salt, (err, data) =>
          err ? reject(err) : resolve(data)))
    )
    .then((digest) => {
      _this.attributes.passwordDigest = digest;
      delete _this.attributes.password;
      console.log(_this);
      return _this;
    });
  },
});

//new User({ email: 'hank@statefarm.com', password: 'hank'}).save();
let found = User.query('where', 'passwordDigest', '=', '$2a$10$sddavB.jzpRyL9Kj0HIPSxiU99oKFwuyKqgSO.').fetch().then(console.log);
//console.log(found);

User.methods.comparePassword = function (password) {
  let _this = this;

  return new Promise((resolve, reject) =>
    bcrypt.compare(password, _this.passwordDigest, (err, data) =>
        err ? reject(err) : data ? resolve(data) : reject(new Error('Not Authorized')))
    ).then(() => _this);
};

User.methods.setPassword = function (password) {
  var _this = this;

  return new Promise((resolve, reject) =>
    bcrypt.genSalt(null, (err, salt) =>
        err ? reject(err) : resolve(salt))
  ).then((salt) =>
    new Promise((resolve, reject) =>
      bcrypt.hash(password, salt, (err, data) =>
        err ? reject(err) : resolve(data)))
  ).then((digest) => {
    _this.passwordDigest = digest;
    return _this.save();
  });
};

// const User = exports.up()
const User = User.model('User', User);

module.exports = User;
