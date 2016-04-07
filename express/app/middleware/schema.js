'use strict';

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
  }).createTableIfNotExists('rules', function(table) {
    table.increments('id').notNullable().primary();
    table.string('name');
    table.integer('temperature');
    table.string('operator');
    table.string('action');
    table.string('active');
    table.timestamps();
  });
};

exports.up(Knex)
.then(() => {
  console.log('Table created sucessfully \n ');
})
.catch((err) => { console.log('Table OK \n');});

module.exports = true;
