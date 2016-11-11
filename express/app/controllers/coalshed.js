'use strict';

const controller = require('express/lib/wiring/controller');
const models = require('express/app/models');
const Coalshed = models.coalshed;

const authenticate = require('./concerns/authenticate');
const multer = require('./concerns/multer.js');
const mainLocation = 'coalshed';

const index = (req, res, next) => {
  let search = {
    main_location: mainLocation,
  }

  new Coalshed()
  .query({
    where: search,
    limit: 1000
  })
  .fetchAll()
  .then(allData => res.json({ allData }))
  .catch(err => next(err));
};

const show = (req, res, next) => {
  let search = {
    main_location: mainLocation,
    sensor_location: req.params.id
  }

  new Coalshed()
  .query({
    where: search,
    limit: 500,
    orderBy: ['created_at', 'DESC']
  })
  .fetchAll()
  .then(boilerData => {
    let graphData = [];

    boilerData.models.forEach(function (e) {
      let dateCreated = e.attributes.created_at;
      let temperature = e.attributes.data;
      let dataPoint = {
        x: dateCreated,
        y: temperature
      };
      graphData.push(dataPoint);
    });

    res.json({ graphData });
  })
  .catch(err => next(err));
};

module.exports = controller({
  index,
  show,
}, { before: [
  { method: multer.single(), only: ['create', 'update'], },
], });
