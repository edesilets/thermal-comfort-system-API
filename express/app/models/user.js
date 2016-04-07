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
    table.string('email').notNullable().unique();
    table.string('token').unique();
    table.string('passwordDigest').notNullable();
    table.timestamps();
  }).createTableIfNotExists('temperatures', function(table) {
    table.increments('id').notNullable().primary();
    table.string('main_topic');
    table.string('data_topic');
    table.float('data');
    table.timestamps();
  });
};

exports.up(Knex)
.then(() => {
  console.log('Table created sucessfully');
})
.catch((err) => { console.log('\n opps little error keep going. \n\n');});

let User = bookshelf.Model.extend({
  tableName: 'users',

  setPassword: function (password) {

    console.log('\n Set Password to: ', password, '\n');
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
