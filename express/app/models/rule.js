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

let Rule = bookshelf.Model.extend({
  tableName: 'rules',
  // initialize: function() {
  //   // things to do on crateion
  // },
});

module.exports = Rule;
