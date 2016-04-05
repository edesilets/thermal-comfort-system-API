'use strict';

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
  return knex.schema.createTableIfNotExists('users', function(table) {
    table.increments('id').notNullable().primary();
    table.string('email'); // .notNullable().unique();
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
