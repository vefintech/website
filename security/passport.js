const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const config = require('../config/config');
const UserModel = require('../models/User')();

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, 
    function (email, password, cb) {
       return UserModel.findOne({ where: {email: email, status: 'ACTIVE'} })
           .then(user => {
                
                if (!user) {
                    return cb(null, false);
                }

                
                if (!bcrypt.compareSync(password, user.password)) {
                    return cb(null, false);
                }

                return cb(null, user);
          })
          .catch(err => {return cb(err,false)});
    }
));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey   : config.secret
},
    function (jwtPayload, cb) {
    return UserModel.findOne({ where: {id: jwtPayload.id, status: 'ACTIVE'} })
        .then(user => {
            return cb(null, user);
        })
        .catch(err => {
            return cb(err,false);
        });
    }
));

passport.serializeUser(function(user, cb) {
    cb(null, user);
  });
  
passport.deserializeUser(function(user, cb) {
    UserModel.findOne({ where: {id: user.id} })
    .then(user => {
         return cb(null, user);
   })
   .catch(err => cb(err,false));    
});