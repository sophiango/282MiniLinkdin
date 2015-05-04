var express = require('express');
var router = express.Router();
var mysqlConnection = require('./mySqlConnection');
var model = require('../models/JobApplication');
var sqlite = require('../database/mysqlSeqlite');
var Company = require('../models/company');
var Job = require('../models/job');
/* GET users listing. */
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

function getJobDataSeries(obj,callback){
	console.log(obj.jobId + " "+obj.companyId);
	
	Job.findOne({jobId:obj.jobId},function(err,foundJob){
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
	console.log('reached route in post');
	console.log("req.body "+req.body.jobId);
	var result = req.body.jobId.split(" ");
	console.log(result[0]+" "+result[1]);
	var userId = req.session.MyID; // mySesn here is number
	//userId.toString(); // optional
	// model.userId=req.body.userId;
	var jobApplication = model.JobApplication.build({
		userId : userId,
		companyId : result[1],
		jobId :result[0]
	});

	console.log('Build jobApplication');
	jobApplication.add(function(success) {
		res.redirect('back');
	}, function(err) {
		//res.redirect({errMsg:"Already Applied for the Job"},'back');
		res.redirect('back');
	});

});

router.get('/:userId', function(req, res) {
	console.log('reached route');
	/*var jobList = {
		    appliedJobs: []
		};*/
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
	
	var jobList = [];

	var jobApplication = model.JobApplication.build();
	
	console.log('userId '+userId+' req.params.userId '+req.params.userId);
	if ((userId !== null) && (userId > 0) ){
	console.log('Got model');
	 var i=0;
	jobApplication.retrieveByUserId(userId,function(jobsApplied) {
		if (jobsApplied) {
			//console.log(jobsApplied);
			//for(var i = 0; i < jobsApplied.length;i++){
				//getJobDataSeries(jobsApplied[i]);
			console.log("Reahing Series");
				function series(i) {
					console.log("jobsApplied.length "+jobsApplied.length);
		        if(i<jobsApplied.length) {
		        	console.log("Reahed If+ Series "+i+" "+jobsApplied[i]);
		        	getJobDataSeries( jobsApplied[i], function(foundJob) {
		        		if (foundJob){
		            	jobList.push(foundJob);}
		                 series(i+1);
		            });
		          } else {
		        	  console.log("$$$$$$$$$$jobList "+jobList);
		              	return res.render('viewAppliedJobs',{jobList:jobList});
		        	//return res.render('index',{jobList:jobList});
		        	 // return res.send(jobList);
		        	  
		          }
		  }
			//jobsApplied.forEach(function(obj) { 
				series(0);
			//console.log("@@@@@@@@@@@@@@jobList "+jobList);
			//res.send(jobList);

		} else {
			res.send(401, "jobApplications not found");
		}
	}, function(error) {
		res.send(error);
	});
}
else{
	res.send("Invalid User Id");
}
});

router.get('/applicants/company/:companyId/jobs/:jobId', function(req, res) {
	console.log('reached route');
	var jobApplication = model.JobApplication.build();
	var companyId = req.params.companyId;
	var jobId = req.params.jobId;
	
	if (((companyId !== null) && (companyId > 0)) ||((jobId !== null) && (jobId > 0)) ){
	console.log('Got model');
	jobApplication.retrieveByCompJobId(companyId,jobId,function(jobApplications) {
		if (jobApplications) {
			console.log(jobApplications);
			res.render('about');

		} else {
			res.send(401, "jobApplicant not found");
		}
	}, function(error) {
		res.send(error);
	});
}
else{
	res.send("Invalid company or job id");
}
});

router.delete('/', function(req, res) {
	console.log('reached route');
	var jobApplication = model.JobApplication.build();
	console.log('Got model');
	jobApplication.removeById(req.body.companyId,req.body.jobId,function(jobApplications) {
		if (jobApplications) {
			console.log(jobApplications);
			res.send(jobApplications);

		} else {
			res.send(401, "jobApplications not found");
		}
	}, function(error) {
		res.send("error");
	});
});

module.exports = router;
