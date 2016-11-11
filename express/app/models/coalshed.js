'use strict';

const bcrypt = require('bcrypt');
const Knex = require("knex")({
  client: "pg",
  connection: {
    host: "localhost",
    user: "pi",
    password: "password",
    database: "test"
  }
});

const bookshelf = require("bookshelf")(Knex);

let status = bookshelf.Model.extend({
  tableName: 'status',
  // initialize: function() {
  //   // things to do on crateion
  // },
});

module.exports = status;
