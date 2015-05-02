/**
 * New node file
 */
var express = require('express');
var router = express.Router();
var mysqlConnection = require('./mySqlConnection');
var model = require('../models/followCompany');
var sqlite = require('../database/mysqlSeqlite');
var Company = require('../models/company');
var jobApplication = require('../models/JobApplication');
var Job = require('../models/job');
var moment = require('moment');
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

function getFCompaniesSeries(obj,callback){
	console.log("In Method "+obj.userId + " "+obj.companyId);
	
	Company.findOne({companyId:obj.companyId},function(err,foundCompanies){
        if (err || foundCompanies===null) {
            console.log(err);
            return callback(foundCompanies);
              }
        else {
            console.log(foundCompanies);
          //  console.log('Found User: ' + foundJob );
            return callback(foundCompanies);
        }
    });
		
	}

function getJobDataSeries(obj,callback){
	console.log(obj.jobId);
	var date =moment().format();
	console.log(date);
	Job.findOne({jobId:obj.jobId,expires: {"$gt":new Date()}},function(err,foundJob){
        if (err){ console.log(err);
        return callback(foundJob);}
        else {
            console.log('Found company: ' + foundJob );
            return callback(foundJob);
           // console.log("$$$$$$$$$$jobList "+jobList);
            //res.status(200).send('Successfully get a job ' + job_id );
        }
    });
		
	}


router.post('/', function(req, res, next) {
	console.log('reached route');
	console.log(req.body);

	var userId = req.session.MyID; // mySesn here is number
	userId.toString(); // optional
	console.log("userId "+userId);
	
	var followCompany = model.FollowCompany.build({
		userId : userId,
		companyId : req.body.companyId
		});

	console.log('Build followCompany');
	followCompany.add(function(success) {
		res.redirect('/user/'+userId+'/home');
	}, function(err) {
		res.redirect('/user/'+userId+'/home');
	});

});

router.get('/:userId', function(req, res) {
	console.log('reached route');
	var followCompany = model.FollowCompany.build();
	var mySesn = req.session.MyID;
	var userId = req.params.userId;
	
	console.log('it works');
	console.log('sessionnnnn checkkk'+mySesn);
   // var user_id = req.params.user_id;
    console.log('user param is'+userId);
   
    if(!mySesn || mySesn=='undefined'|| mySesn.toString()!=userId)
    	{
    	 console.log('u r trapped, my friend');
    	return res.redirect('/login');
    	}
	console.log('userId '+userId+' req.params.userId '+req.params.userId);
	if ((userId !== null) && (userId > 0) ){
	console.log('Got model');
	var fComapanyList = [];
	followCompany.retrieveByUserId(userId,function(followCompanys) {
		if (followCompanys) {
			console.log(followCompanys);
		    console.log("Reahing Series");
			function series(i) {
				console.log("jobsApplied.length "+followCompanys.length);
	        if(i<followCompanys.length) {
	        	console.log("Reahed If+ Series "+i+" "+followCompanys[i]);
	        	getFCompaniesSeries( followCompanys[i], function(foundCompanies) {
	        		if (foundCompanies){
	        		fComapanyList.push(foundCompanies);}
	                 series(i+1);
	            });
	          } else {
	        	  console.log("$$$$$$$$$$connectionList "+fComapanyList);
	              	//return res.render('viewEditConnections',{fComapanyList:fComapanyList,userId:userId});
	        	//return res.render('index',{jobList:jobList});
	        	return res.send({fComapanyList:fComapanyList,userId:userId});
	        	  
	          }
			 }
			//jobsApplied.forEach(function(obj) { 
				series(0);

		} else {
			res.send(401, "followCompany not found");
		}
	}, function(error) {
		res.send(error);
	});
}
else{
	res.send("Invalid User Id");
}
});

router.get('/followers/:companyId', function(req, res) {
	console.log('reached route');
	var followCompany = model.FollowCompany.build();
	var companyId = req.params.companyId;
		
	if ((companyId !== null) && (companyId > 0)){
	console.log('Got model');
	followCompany.retrieveByCompId(companyId,function(followCompanys) {
		if (followCompanys) {
			console.log(followCompanys);
			res.send(followCompanys);

		} else {
			res.send(401, "followers not found");
		}
	}, function(error) {
		res.send(error);
	});
}
else{
	res.send("Invalid company id");
}
});

router.get('/count/:companyId', function(req, res) {
	console.log('reached route');
	var followCompany = model.FollowCompany.build();
	var companyId = req.params.companyId;
		
	if ((companyId !== null) && (companyId > 0)){
	console.log('Got model');
	followCompany.retrieveCoutByCompId(companyId,function(userCount) {
		if (userCount) {
			console.log(userCount);
			res.send({'userCount':userCount});

		} else {
			res.send(401, "followers not found");
		}
	}, function(error) {
		res.send(error);
	});
}
else{
	res.send("Invalid company id");
}
});

router.get('/:userId/jobs', function(req, res) {
	console.log('reached route');
	var mySesn = req.session.MyID;
	var userId = req.params.userId;
	
	console.log('it works');
	console.log('sessionnnnn checkkk'+mySesn);
   // var user_id = req.params.user_id;
    console.log('user param is'+userId);
   
    if(!mySesn || mySesn=='undefined'|| mySesn.toString()!=userId)
    	{
    	 console.log('u r trapped, my friend');
    	return res.redirect('/login');
    	}
	console.log('userId '+userId+' req.params.userId '+req.params.userId);
	var jobsApplied=jobApplication.JobApplication.build();
	var followCompany = model.FollowCompany.build();
	
	var jobList = [];
	console.log('userId '+userId+' req.params.userId '+req.params.userId);
	var datetime = new Date();
	console.log("datetime "+datetime);
	mysqlConnection.connection.getConnection(function(err, connection){
	console.log('Got Connected');
	connection.query('select a.jobId from CompanyJob a,FollowCompany c where c.userId=? and c.companyId=a.companyId and a.jobId not in (select b.jobId from JobApplication b where b.userId=?)',[userId,userId],function(err, jobs, fields) {
		  if (jobs)
		  {
				console.log(jobs);
			    console.log("Reahing Series");
				function series(i) {
					console.log("jobsApplied.length "+jobs.length);
		        if(i<jobs.length) {
		        	console.log("Reahed If+ Series "+i+" "+jobs[i]);
		        	getJobDataSeries( jobs[i], function(foundJobs) {
		        		if (foundJobs){
		        			jobList.push(foundJobs);}
		                    series(i+1);
		            });
		          } else {
		        	  console.log("$$$$$$$$$$connectionList "+jobList);
		              	//return res.render('viewEditConnections',{fComapanyList:fComapanyList,userId:userId});
		        	//return res.render('index',{jobList:jobList});
		        	  connection.release();
		        	return res.render("viewFollowComJobs",{jobList:jobList,userId:userId});
		        	  
		          }
				 }
				//jobsApplied.forEach(function(obj) { 
					series(0);
			} else {connection.release();
			return res.render("viewFollowComJobs",{jobList:jobList,userId:userId});
			}
		});
	});
});
	


router.delete('/', function(req, res) {
	console.log('reached route');
	var followCompany = model.FollowCompany.build();
	console.log('Got model');
	followCompany.removeByUserId(req.body.userId,function(followCompanys) {
		if (followCompanys) {
			console.log(followCompanys);
			res.send("Deleted Successfully");

		} else {
			res.send(401, "follow company deletion found");
		}
	}, function(error) {
		res.send(error);
	});
});

module.exports = router;
