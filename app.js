var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var config = require('./config');
var flash = require('connect-flash');
var web_router = require('./web_router');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var app = express();

//redis session设置
app.use(session({
  secret: config.session_secret,
  //创建存储session的redis储存器
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
  store: new RedisStore({
    port: config.redis_port,
    host: config.redis_host
  }),
  resave: true,//?
  saveUninitialized: true,//?
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');
app.engine("html",require("ejs").__express);
app.set('view engine', 'html');
app.use(flash());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', web_router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
