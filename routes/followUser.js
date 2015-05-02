/**
 * New node file
 */
var express = require('express');
var router = express.Router();
var mysqlConnection = require('./mySqlConnection');
var model = require('../models/followUser');
var sqlite = require('../database/mysqlSeqlite');
var User = require('../models/user');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var Company = require('../models/company');
var bcrypt = require('bcrypt-nodejs');
var app = express();


app.use(logger('dev'));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
	  secret: 'keyboard cat',
	  resave: true,
	  saveUninitialized: true
	}));

/* GET users listing. */

function getConectionsSeries(obj,callback){
	//console.log(obj.jobId + " "+obj.companyId);
	
	User.findOne({userId:obj.connectionId},function(err,foundUser){
        if (err || foundUser===null) {
            console.log(err);
            return callback(foundUser);
              }
        else {
            console.log(foundUser);
          //  console.log('Found User: ' + foundJob );
            return callback(foundUser);
        }
    });
		
	}


router.post('/', function(req, res, next) {
	console.log('reached route');
	console.log(req.body.userId);
	var userId = req.session.MyID; // mySesn here is number
	console.log('reached route '+userId);
	userId.toString(); // optional

	// model.userId=req.body.userId;
	var followUser = model.FollowUser.build({
		userId : userId,
		connectionId : req.body.connectionId
		});

	console.log('Build followUser');
	followUser.add(function(success) {
		res.redirect('/user/'+userId+'/home');
	}, function(err) {
		res.redirect('/user/'+userId+'/home');
	});

});

router.get('/:userId', function(req, res) {
	console.log('reached route');
	var userId = req.params.userId;
	var mySesn = req.session.MyID;
	console.log('it works');
	console.log('sessionnnnn checkkk'+mySesn);
   // var user_id = req.params.user_id;
    console.log('user param is'+userId);
   
    if(!mySesn || mySesn=='undefined'|| mySesn.toString()!=userId)
    	{
    	 console.log('u r trapped, my friend');
    	return res.redirect('/login');
    	}
	var followUser = model.FollowUser.build();
	
	console.log('userId '+userId+' req.params.userId '+req.params.userId);
	//if ((userId !== null) && (userId > 0) ){
	console.log('Got model');
	var connectionList = [];
	followUser.retrieveByUserId(userId,function(followUsers) {
		if (followUsers) {
			console.log(followUsers);
			console.log("Reahing Series");
			function series(i) {
				console.log("jobsApplied.length "+followUsers.length);
	        if(i<followUsers.length) {
	        	console.log("Reahed If+ Series "+i+" "+followUsers[i]);
	        	getConectionsSeries( followUsers[i], function(foundUser) {
	        		if (foundUser){
	        		connectionList.push(foundUser);}
	                 series(i+1);
	            });
	          } else {
	        	  console.log("$$$$$$$$$$connectionList "+connectionList);
	              	return res.render('viewEditConnections',{connectionList:connectionList,userId:userId});
	        	//return res.render('index',{jobList:jobList});
	        	// return res.send(connectionList);
	        	  
	          }
	  }
		//jobsApplied.forEach(function(obj) { 
			series(0);

		} else {
			res.send(401, "followUser not found");
		}
	}, function(error) {
		res.send(error);
	});

});



router.get('/count/:userId', function(req, res) {
	console.log('reached route');
	var followUser = model.FollowUser.build();
	var userId = req.params.userId;
		

	console.log('Got model');
	followUser.retrieveCoutByUserId(userId,function(connCount) {
		if (connCount) {
			console.log(connCount);
			res.send({'connCount':connCount});

		} else {
			res.send(401, "followers not found");
		}
	}, function(error) {
		res.send(error);
	});

});

router.post('/delete', function(req, res) {
	console.log('reached route');
	var followUser = model.FollowUser.build();
	var userId=req.body.userId;
	console.log('Got model '+req.body);
	followUser.removeById(userId,req.body.connectionId,function(followUsers) {
		if (followUsers) {
			console.log(followUsers);
			console.log("Reached delete success");
			res.redirect('back');

		} else {
			console.log( "Not able to delete ");
			res.redirect('/user/'+userId+'/home');
		}
	}, function(error) {
		res.send(error);
	});
});

module.exports = router;
