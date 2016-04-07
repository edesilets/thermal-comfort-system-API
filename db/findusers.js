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
let bookshelf = require("bookshelf")(Knex);
let ModelBase = require('bookshelf-modelbase')(bookshelf);
const bcrypt = require('bcrypt');

let moment = require("moment"); // for time stamp

let User = ModelBase.extend({
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

// new User({ email: 'tester@test.com', password: 'password'})
// .save();
// .then(console.log)
// .then(() => {
//   User.findOne({ email: 'tester@test.com'})
//     .then()
//     .catch(console.log);
// })

// id | email  | token passwordDigest  | created_at | updated_at
User.create({ email: 'test@test.com', token: 'helpmee', passwordDigest: 'fuckthis', created_at: moment().format(), updated_at: moment().format() })
.then( () => {
  return User.findOne({ email: 'test@test.com' }, { require: true });
})
.then( (tester) => {
  // passes patch: true to .save() by default
  return User.update({ passwordDigest: 'Basil' }, { id: tester.id });
})
// .then( (basil) => {
//   return User.destroy({ id: basil.id });
// })
.then( () => {
  console.log(User.findAll());
  return User.findAll();
})
.then( (collection) => {
  console.log(collection.models.length); // => 0
})
.catch(console.log);
