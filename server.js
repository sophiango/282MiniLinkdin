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

mongoose.connect('mongodb://cmpe282:cmpe282@ds031982.mongolab.com:31982/demo282');
//mongoose.connect('mongodb://spurthysambidi:spurthy20@ds037617.mongolab.com:37617/final282');
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
app.use(express.static('public'));
// app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    console.log('did it run first?');
    if (!req.session){
        console.log('it wonttt run');
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'); }
    next();
});

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

var debug = require('debug')('minilinkedin:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

//var port = normalizePort(process.env.PORT || '3000');
var port = 8080;
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}


module.exports = app;