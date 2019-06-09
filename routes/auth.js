const express = require('express');
const ejs = require('ejs');
const path = require('path');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const router  = express.Router();
const passport = require('passport');
const service = require('../services/user');
const config = require('../config/config');
var utils = require('../services/utils');
const email = require('../services/email');

router.get('/signIn', function (req, res, next) {
    res.render('login');
});

router.get('/signOut', 
ensureLoggedIn('/auth/signIn'),
function (req, res, next) {
    if (req.session) {
        delete res.locals.user;
        // delete session object
        req.session.destroy(function(err) {
          if(err) {
            return next(err);
          } else {
            return res.redirect('/');
          }
        });
    }
});

router.get('/change-password', 
ensureLoggedIn('/auth/signIn'),
function (req, res, next) {
    const activeMenu= utils.getActiveMenu("changePassword");
    res.render('change_password', {activeMenu: activeMenu});    
});

router.post('/change-password', 
ensureLoggedIn('/auth/signIn'),
function (req, res, next) {
    var o = {};
    o.password = req.body.password;

    service.update(req.user.uid,o).then(function(data) {
        if (!data.success) {
          req.flash('error', data.msg);
          res.redirect('/change-password');
        }
        else {
            const t = path.join(__dirname, '..','views','emails','change_password.ejs');        
            ejs.renderFile(t, {email: req.user.email}, function(err, html){
                if (!err) {
                    const options = {
                        to: req.user.email, 
                        subject: 'Fintech de Venezuela te informa', 
                        html: html
                      };
                      email.emit(options);
                }
          
            });

          req.flash('notice', "Clave modificada");
          res.redirect('/admin');
        }
        
      })
      .catch(function(err) {
        next(err);
      });        
});


router.get('/forgot-password/:email', function (req, res, next) {
    const email = req.params.email;

});

router.post('/signIn', 
    passport.authenticate('local',
        {   
            failureRedirect: '/auth/signIn' ,
            failureFlash: 'Credenciales no validas' 
        }
    ),
    function (req, res, next) {
        const t = path.join(__dirname, '..','views','emails','login.ejs');     

        ejs.renderFile(t, {email: req.body.email ,url: config.home}, function(err, html){
            if (!err) {
                const options = {
                    to: req.body.email, 
                    subject: 'Fintech de Venezuela te informa', 
                    html: html
                  };
                  email.emit(options);
            }

        });

        res.redirect('/admin');       
    }
);


module.exports = router;