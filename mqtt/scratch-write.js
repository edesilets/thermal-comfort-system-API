'use strict';

var moment = require("moment"); // for time stamp
var Knex = require("knex")({
  client: "pg",
  connection: {
    host: "localhost",
    user: "pi",
    password: "password",
    database: "homestatus"
  }
});

var Bookshelf = require("bookshelf")(Knex);
var Temperature = Bookshelf.Model.extend({
    tableName: 'temperatures'
});

let data = { temperature: 110, topic: 'blah' };

new Temperature(data).save()
.then(() => {
  let tempCount = Temperature.count();
  console.log(tempCount);
})
.then(() => {
  Knex.destroy();
  console.log("just ran temperature data save");
});
