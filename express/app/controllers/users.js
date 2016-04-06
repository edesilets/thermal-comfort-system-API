'use strict';

const debug = require('debug')('thermal-monitor:users');

const controller = require('express/lib/wiring/controller');
const models = require('express/app/models');
const User = models.user;

const crypto = require('crypto');

const authenticate = require('./concerns/authenticate');
const multer = require('./concerns/multer.js');

const HttpError = require('express/lib/wiring/http-error');

const getToken = () =>
  new Promise((resolve, reject) =>
    crypto.randomBytes(16, (err, data) =>
      err ? reject(err) : resolve(data.toString('base64'))
    )
  );

const userFilter = { passwordDigest: 0, token: 0 };

const index = (req, res, next) => {
  User.find({}, userFilter)
    .then(users => res.json({ users }))
    .catch(err => next(err));
};

const show = (req, res, next) => {
  User.findById(req.params.id, userFilter)
    .then(user => user ? res.json({ user }) : next())
    .catch(err => next(err));
};

const makeErrorHandler = (res, next) =>
  error =>
    error && error.name && error.name === 'ValidationError' ?
      res.status(400).json({ error }) :
    next(error);

const signup = (req, res, next) => {
  let credentials = req.body.credentials;
  let user = {
                email: credentials.email,
                password: credentials.password,
              };
  getToken().then(token =>
    user.token = token
  )
  .then(() => {
    return new User(user).save();
  })
  .then(newUser => {
    let user = newUser.attributes;
    delete user.passwordDigest;
    res.json({ user });
  })
  .catch(makeErrorHandler(res, next));
};

const signin = (req, res, next) => {
  let credentials = req.body.credentials;
  let search = { email: credentials.email };
  new User(search).fetch()
  .then(user =>
    user ? user.comparePassword(credentials.password) : Promise.reject(new HttpError(404))
  )
  .then(user => {
    getToken().then(token => {
      user.token = token;
      return new User(search).save(user, { patch: true })
      .then((userData) => {
        let user = userData.attributes;
        delete user.passwordDigest;
        console.log('yayaya user obj: \n', user);
        res.json({ user });
      });
    });
  })
  .catch(makeErrorHandler(res, next));
};

const signout = (req, res, next) => {
  getToken().then((token) => {
    let findUser = {
      id: req.params.id,
      token: req.currentUser.token
    };
    new User(findUser)
    .save({
      token: token
    },{
      patch: true
    });
  })
  .then((user) =>
    user ? res.sendStatus(200) : next()
  ).catch(next);
};

const changepw = (req, res, next) => {
  debug('Changing password');
  // User.findOne({
  //   _id: req.params.id,
  //   token: req.currentUser.token,
  // }).then(user =>
  //   user ? user.comparePassword(req.body.passwords.old) :
  //     Promise.reject(new HttpError(404))
  // ).then(user =>
  //   user.setPassword(req.body.passwords.old)
  // ).then((/* user */) =>
  //   res.sendStatus(200)
  // ).catch(makeErrorHandler(res, next));
};

module.exports = controller({
  index,
  show,
  signup,
  signin,
  signout,
  changepw,
}, { before: [
  { method: authenticate, except: ['signup', 'signin'], },
  { method: multer.single(), except: ['index', 'show', 'signout'], },
], });
