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
.catch((err) => { console.log('opps little error keep going.');});

let User = bookshelf.Model.extend({
  tableName: 'users',
  initialize: function() {
    this.on('creating', this.setPassword, this);
    //this.on('updating', this.comparePassword, this);
  },
  setPassword: function (password) {
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
      return _this.attributes;
    });
  },
});

// let _this = this;
// new User({ 'email': _this.attributes.email })
// .fetch()
// .then((data) => {
//   let passwordDigest = data.attributes.passwordDigest;
//   let dbUser = data;
//   // console.log('Compare Password: passwordDigest: ', passwordDigest);
//   // console.log('Compare Password: password: ', _this.attributes.password);
//   return new Promise((resolve, reject) =>
//     bcrypt.compare(_this.attributes.password, passwordDigest, (err, data) =>
//       err ? reject(err) : data ? resolve(data) : reject(new Error('Not Authorized')))
//     )
//     .then((data) => {
//       // trying to send back user in data base.
//       if (data) {
//         console.log('\n New Promise dbUser: ', dbUser.attributes);
//         return dbUser.attributes;
//       }
//     });
// });
// let user = {
//   email: 'jake@farm.com',
// //  password: 'password',
// //  token: 'Mq6jGEk4bgpzICalHLwm3Q=='
// };
//
// let patchUser = {
//   email: 'jake@farm.com',
// };

// new User({ email: 'kake@statefarm.com', password: 'password'}).save();
// new User({ email: 'OnthisShit', password: 'password'}).save();
// new User({ email: 'jake@farm.com', password: 'password'}).save();
// new User({ email: 'jess@statefarm.com', password: 'password'}).save();
// let found = User.query('where', 'passwordDigest', '=', '$2a$10$sddavB.jzpRyL9Kj0HIPSxiU99oKFwuyKqgSO.').fetch().then(console.log);
//console.log(found);

// new User(user).fetch().then((data) => {
//   //console.log('BEFORE: this is the fetch data:  ', data,'\n');
// }).then(() => {
//   new User(patchUser).save({ password: 'password' }, { patch: true }).then(console.log).then(() => {
//     new User(user).fetch().then((data) => {
//       console.log('AFTER: this is the fetch data: ', data, '\n');
//     });
//   });
// });

// new User(user).save([key], [val], [attrs], [options]);

module.exports = User;
