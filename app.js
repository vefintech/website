const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash-messages');
const config = require('./config/config');
var moment = require('moment');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
const associatesRouter = require('./routes/associates');

const usersApi = require('./routes/users.api');

const auth = require('./routes/auth');
var i18n = require("i18n");
const app = express();

i18n.configure({
  locales:['es', 'en'],
  directory: __dirname + '/i18n',
  defaultLocale: config.preferedLanguage
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: config.secret,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require('./security/passport');

app.use(function(req, res, next) {
  res.locals.authenticated = false;
  if (req.user) {
    res.locals.authenticated =  true;
  }
  console.log(res.locals);
  next();
  
});

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/admin/usuarios',usersRouter);
app.use('/admin/asociados',associatesRouter);
app.use('/auth', auth);

app.use('/api/admin/usuarios',usersApi);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log("2");
  res.locals.authenticated = false;
  if (req.user) {
    res.locals.authenticated =  true;
  }

  res.render('404');
});

// error handler
app.use(function(err, req, res, next) {
  console.log("3");

  // set locals, only providing error in development
  res.locals.status = err.status;
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);

  if (req.xhr) {
    res.json(err);
  }
  else {
    if (err.status==404) {
      res.render('404');
    }
    else {
      res.render('error');
    }
    
  }
  
});


module.exports = app;
