'use strict';

// const mongoose = require('mongoose');
// const uri = process.env.MONGOLAB_URI || 'mongodb://localhost/thermal-monitor';
// mongoose.Promise = global.Promise;
// mongoose.connect(uri);

const Knex = require("knex")({
  client: "pg",
  connection: {
    host: "localhost",
    user: "pi",
    password: "password",
    database: "homestatus"
  }
});

// const uri = process.env.DATABASE_URL || 'postgresql://localhost/connectdb'
const Bookshelf = require("bookshelf")(Knex);

//module.exports = mongoose;
module.exports = Bookshelf;
