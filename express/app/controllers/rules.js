'use strict';

const controller = require('express/lib/wiring/controller');
const models = require('express/app/models');
const Rule = models.rule;

const authenticate = require('./concerns/authenticate');
const multer = require('./concerns/multer.js');

const create = (req, res, next) => {
  let insert = req.body.rule
  console.log('\n Request Owner: \n', req.currentUser);
  console.log('\n Request body to be created: \n', insert);
  new Promise(function(resolve, reject) {
    new Rule(insert).save()
      .then(newRule => res.json({ newRule }))
      .catch(err => next(err));;
  });
};

const destroy = (req, res, next) => {
  let search = { id: req.params.id };
  console.log('\n destroy \n');
  new Rule(search).destroy()
  .then(() => res.sendStatus(200))
  .catch(err => next(err));
};

module.exports = controller({
  create,
  destroy,
}, { before: [
  { method: authenticate, only: ['create', 'destroy'], },
  { method: multer.single(), only: ['create'], },
], });
