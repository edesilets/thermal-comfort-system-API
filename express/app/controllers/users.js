'use strict';

const debug = require('debug')('thermal-monitor:users');

const controller = require('express/lib/wiring/controller');
const models = require('express/app/models');
const User = models.user;

const crypto = require('crypto');

const authenticate = require('./concerns/authenticate');
const multer = require('./concerns/multer.js');

const HttpError = require('express/lib/wiring/http-error');

const getToken = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(16, (err, data) => {
      err ? reject(err) : resolve(data.toString('base64'));
    });
  });
};

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
    return new User(user).setPassword(user.password);
  })
  .then((user) => user.save())
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
  .then((user) => {
    return user? user.comparePassword(credentials.password) :
                 Promise.reject(new HttpError(404));
  })
  .then((user) => {
    return getToken().then((token) => {
      user.attributes.token = token;
      console.log('user attributes:\n', user.attributes);
      return user.save();
    });
  })
  .then((user) => {
    console.log('userModel:\n', user);
    let userAttributes = user.attributes;
    delete userAttributes.passwordDigest;
    res.json({ userAttributes });
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
    }).then((user) => user ? res.sendStatus(200) : next(new HttpError(404)));
  })
  .catch(next);
};

const changepw = (req, res, next) => {
  debug('Changing password');
  let credentials = req.body.passwords;
  let search = {
                id: req.params.id,
                token: req.currentUser.token,
              };
  new User(search).fetch()
  .then((searchResult) => {
    if (searchResult) {
      searchResult.comparePassword(req.body.passwords.old).then((user) => {
        delete user.attributes.passwordDigest;
        return user.setPassword(credentials.new);
      })
      .then((user)=> {
        return user.save();
      })
      .then((user) => {
        user ? res.sendStatus(200) : next(new HttpError(404));
      })
      .then(new HttpError(404));
    } else {
      Promise.reject(new HttpError(404));
    }
  })
  .then(console.log);
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
