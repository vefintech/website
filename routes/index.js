var express = require('express');
const ejs = require('ejs');
var moment = require('moment');
const excel = require('node-excel-export');
const jwt = require('jsonwebtoken');
const path = require('path');
const utils = require('../services/utils');
const service = require('../services/asocciate');
const serviceUser = require('../services/user');
const emailService = require('../services/email');
const config = require('../config/config');
var formidable = require('formidable');

var router = express.Router();

const activeMenu= utils.getActiveMenu("");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.locals.authenticated = false;
  if (req.user) {
    res.locals.authenticated =  true;
  }
  service.indicatorsIndex()
    .then(function(data) { 
      res.render('index',{activeMenu: activeMenu,associate: null,stats: data.data});
    })
    .catch(function(err) {
      next(err);
    });    
  
});

router.get('/validar-registro', function(req, res, next) {
  const token = req.query.token || '98798987';

  var decoded= null;
  try {
    decoded = jwt.verify(token, config.secret);
  } catch(err) {
     var e = new Error("El token de registro ya no es valido. Comuniquese por correo electronico con nosotros y le ayudaremos a finalizar su registro.");
     e.status = 500;
     throw e;
  }

  serviceUser.validate(decoded.subject)
            .then(function(data){
              if (data.success) {
                res.render('registered_confirmed');
              }
              else {
                var e = new Error(data.msg);
                e.status = data.code;
                throw e;
              }
              
            })
            .catch(function(e){
                next(e);
            });
  
});

router.get('/validar-recuperar-clave', function(req, res, next) {
  const token = req.query.token || '98798987';
  

  var decoded= null;
  try {
    decoded = jwt.verify(token, config.secret);
  } catch(err) {
     var e = new Error("El token de validacion ya no es valido");
     e.status = 500;
     throw e;
  }

  res.render('forgot_password_form',{token:token,activeMenu: activeMenu});

});

router.post('/validar-recuperar-clave', function(req, res, next) {
  const token = req.body.token || '98798987';

  var decoded= null;
  try {
    decoded = jwt.verify(token, config.secret);
  } catch(err) {
     var e = new Error("El token de validacion ya no es valido");
     e.status = 500;
     throw e;
  }

  var body = {email: decoded.subject, password: req.body.password};

  serviceUser.resetPassword(body)
            .then(function(data){
              if (data.success) {
                res.render('forgot_password_complete');
              }
              else {
                var e = new Error(data.msg);
                e.status = data.code;
                throw e;
              }
              
            })
            .catch(function(e){
                next(e);
            });
  
});

router.post('/registrar', function(req, res, next) {
  var o = {image: '',status: 'INACTIVE'};
  var form = new formidable.IncomingForm();
  form.parse(req);

  form
    .on('fileBegin', function (name, file){
      if (file.name!='') {
          o['image'] ="i"+moment().format("YYYYhhmmss")+file.name;
          file.path = path.join(__dirname, '..','public','img','associates',o['image']);
        }

      })
      .on('error', function(err) {
        req.flash('error', err.message);
        res.render('index', {activeMenu: activeMenu,associate: o});
      })
      .on('field', function(field, value) {
        o[field] =value;
      })
      .on('end', function() {
        if (o.bot!='') {
          req.flash('error', "Existen errores en sus datos");
          res.render('index', {activeMenu: activeMenu,associate: o});
        }
        else {
          o.status= 'INACTIVE';
          service.create(o)
          .then(function(data) {

            var token = jwt.sign({
              iat: config.registerLinkTime,
              subject: o.email
            }, config.secret);

            var link = config.home+"/validar-registro?token="+token;

            const t = path.join(__dirname, '..','views','emails','welcome.ejs');        
            ejs.renderFile(t, {email: o.email , link: link}, function(err, html){
                if (!err) {
                    const options = {
                        to: o.email, 
                        subject: 'Bienvenido a la comunidad Fintech de Venezuela', 
                        html: html
                      };
                      emailService.emit(options);
                }
    
            });
               
            
            res.render('registered', {activeMenu: activeMenu,associate: o});
          })
          .catch(function(err) {
            next(err);
            //req.flash('error', err.message);
            //res.render('index', {activeMenu: activeMenu,associate: o});
          });
        
        }
  });

  
});

router.get('/recuperar-clave', function(req, res, next) {
  res.render('forgot_password',{activeMenu: activeMenu});
});

router.post('/recuperar-clave', function(req, res, next) {
  const email = req.body.email;

  serviceUser.me(email)
    .then(function(data){
      
      if (data.success) {
        var token = jwt.sign({
          iat: config.registerLinkTime,
          subject: email
        }, config.secret);

        var link = config.home+"/validar-recuperar-clave?token="+token;

        const t = path.join(__dirname, '..','views','emails','forgot_password.ejs');        
        ejs.renderFile(t, {email: email , link: link}, function(err, html){
            if (!err) {
                const options = {
                    to: email, 
                    subject: 'Recuperacion de clave. Fintech de Venezuela', 
                    html: html
                  };
                  emailService.emit(options);
            }
      
        });
      }

    
      res.render('forgot_sended',{email: email});
    })
    .catch(function(err){next(err)})
  
});

router.get('/afiliados', function(req, res, next) {
  res.locals.authenticated = false;
  if (req.user) {
    res.locals.authenticated =  true;
  }
    
  service.search({type: '',q: '',page:1, limit: 99999})
  .then(function(dataSearch) { 
    res.render('asocciates',{activeMenu: activeMenu,associate: null,members: dataSearch.data.data});
  })
  .catch(function(err) {
    next(err);
  });
})
module.exports = router;