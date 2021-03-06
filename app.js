require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session')({
  secret: 'some-random-password-elouel',
  resave: true,
  saveUninitialized: true
});
var indexRouter = require('./routes/index');
var assetsRouter = require('./routes/assets')
var oauthCallbackRouter = require('./routes/oauthCallback')

var app = express();

const { isAuthenticated } = require('./src/user-utils')
const { keepHerokuFromIdling } = require('./src/heroku-utils')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(session)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/assets', isAuthenticated, assetsRouter);
app.use('/oauthCallback', oauthCallbackRouter)



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// pings app each 25mins to keep it from sleeping
keepHerokuFromIdling('0:25:00')

module.exports = app;
