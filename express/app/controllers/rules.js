'use strict';

const controller = require('express/lib/wiring/controller');
const models = require('express/app/models');
const Rule = models.rule;

const authenticate = require('./concerns/authenticate');
const multer = require('./concerns/multer.js');

const index = (req, res, next) => {
  new Rule()
  .fetchAll()
  .then(allRules => res.json({ allRules }))
  .catch(err => next(err));
};

const show = (req, res, next) => {
  let search = { id: req.params.id };
  new Rule(search)
  .fetch()
  .then(rule => res.json({ rule }))
  .catch(err => next(err))
};

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

const update = (req, res, next) => {
  let search = { id: req.params.id };
  let update = req.body.rule;
  new Rule(search)
    .save(update, {patch: true})
    .then((newModel) => newModel ? res.sendStatus(200) : next(new HttpError(404)))
    .catch(err => next(err));
};

const destroy = (req, res, next) => {
  let search = { id: req.params.id };
  console.log('\n destroy \n');
  new Rule(search).destroy()
  .then(() => res.sendStatus(200))
  .catch(err => next(err));
};

module.exports = controller({
  index,
  show,
  create,
  update,
  destroy,
}, { before: [
  { method: authenticate, only: ['create', 'destroy','update', 'show', 'index'], },
  { method: multer.single(), only: ['create', 'update'], },
], });
