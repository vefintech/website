const express = require('express');
const service = require('../services/user');

const router = express.Router();

router.get('/admin', function(req, res, next) {

  const pageData = {
    page: req.query.start?(parseInt(req.query.start)): 0,
    limit: req.query.length?parseInt(req.query.length): 10,
  };

  service.pageListAdmin(pageData)
    .then(function(data) {
      
      res.json(data.data);
    })
    .catch(function(err) {
      var e = new Error(err.message);
      e.status = 500;
      next(e);
    });

});

router.get('/', function(req, res, next) {

  const pageData = {
    page: req.query.start?(req.query.start): 0,
    limit: req.query.length || 10,
  };

  service.pageList(pageData)
    .then(function(data) {
      res.json(data.data);
    })
    .catch(function(err) {
      next(err);
    });

});

module.exports = router;
