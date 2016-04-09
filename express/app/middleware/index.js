'use strict';

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const loader = require('express/lib/wiring/loader');

var whitelist = ['http://edesilets.github.io', 'http://localhost:8080'];
var corsOptions = {
  origin: function(origin, callback){
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  }
};



const before = (app) => {
  app.use(cors(corsOptions));
  app.use(favicon(path.join(app.get('root'), 'public', 'favicon.ico')));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
};

const after = (app) => {
  app.use(express.static(path.join(app.get('root'), 'public')));
};

const middleware = loader(__filename);
middleware.before = before;
middleware.after = after;

module.exports = middleware;
