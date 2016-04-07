'use strict';

const controller = require('express/lib/wiring/controller');

/* GET home page. */
const root = (req, res) => {
  res.json({ index: { title: 'The backend' } });
};

module.exports = controller({
  root,
});
