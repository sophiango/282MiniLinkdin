var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var company = require('./routes/company');
var user = require('./routes/user');
var staticId = require('./routes/staticId');
var expressLayouts = require('express-ejs-layouts');
var mongoose = require('mongoose');
var jobApplication = require('./routes/jobApplication');
var followCompany = require('./routes/followCompany');
var followUser = require('./routes/followUser');
var search = require('./routes/search');
var session = require('express-session');
var app = express();
var moment = require('moment');
var shortDateFormat = "YY/M/DD HH:MM:SS"; // this is just an example of storing a date format once so you can change it in one place and have it propagate
app.locals.moment = moment; // this makes moment available as a variable in every EJS page
app.locals.shortDateFormat = shortDateFormat;

//mongoose.connect('mongodb://54.67.121.165:27017/minilinkedin');
mongoose.connect('mongodb://spurthysambidi:spurthy20@ds041167.mongolab.com:41167/azuredb');
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
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
	  secret: 'keyboard cat',
	  resave: true,
	  saveUninitialized: true
	}));

app.use('/', routes);
app.use('/user', user);
app.use('/company', company);
app.use('/jobApplications', jobApplication);
app.use('/fCompanys', followCompany);
app.use('/connections', followUser);
app.use('/search', search);
app.use('/staticId', staticId);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.render('404');
});

module.exports = app;