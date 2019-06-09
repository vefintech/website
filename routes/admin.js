var express = require('express');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var moment = require('moment');
var router = express.Router();
const utils = require('../services/utils');
const activeMenu= utils.getActiveMenu("");
const service = require('../services/asocciate');


/* GET home page. */
router.get('/', 
ensureLoggedIn('/auth/signIn'),
function(req, res, next) {
  service.indicators()
    .then(function(data) {   
      service.search({page: 1, limit: 5,q: '',type: ''})
      .then(function(dataSearch) {   
        
        res.render('admin', {
          stats: data.data,
          moment: moment,
          associates: {
            data: dataSearch.data.data,
            page: 1, 
            limit: 5 ,
            total: dataSearch.data.recordsTotal 
          },          
          activeMenu: activeMenu});
      })
      .catch(function(err) {
        next(err);
      });
    })
    .catch(function(err) {
      next(err);
    });


});


module.exports = router;