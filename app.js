var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var company = require('./routes/company');
var user = require('./routes/user');
var expressLayouts = require('express-ejs-layouts');
var mongoose = require('mongoose');
var app = express();

//mongoose.connect('mongodb://54.67.121.165:27017/minilinkedin');
mongoose.connect('mongodb://localhost/minilinkedin');
//mongoose.connection.on('open', function() {
//console.log(mongoose.connection.collection);
//mongoose.connection.db.collectionNames(function (err, names) {
//    console.log(names);
//    //mongoose.disconnect();
//});
//});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/user', user);
app.use('/company', company);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.render('404');
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('500', { error: err.message });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('500', {error: err.message});
});


module.exports = app;