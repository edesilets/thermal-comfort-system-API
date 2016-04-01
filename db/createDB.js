'use strict';

let moment = require("moment"); // for time stamp
let Knex = require("knex")({
  client: "pg",
  connection: {
    host: "localhost",
    user: "pi",
    password: "password",
    database: "homestatus"
  }
});

exports.up = function(knex, Promise) {
  return knex.schema.createTable('temperatures', function(table) {
    table.increments('id').primary();
    table.string('temperature');
    table.string('topic');
  });
};

exports.up(Knex)
.catch((err) => {
  Knex.destroy();
  console.log("Connection closed..");
  throw err;
})
.then(() => {
  console.log('Table created sucessfully');
  Knex.destroy();
  console.log("Connection closed..");
});
