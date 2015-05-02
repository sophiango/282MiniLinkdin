/**
 * New node file
 */
var express = require('express');
var router = express.Router();
var mysqlConnection = require('./mySqlConnection');
var users = require('../models/user');
var jobs = require('../models/job');
var companys =  require('../models/company');
var sqlite = require('../database/mysqlSeqlite');
var mc = require('mc');

/*var MemcacheClient = new mc.Client("127.0.0.1");
MemcacheClient.connect(function() {
        console.log("Connected to memcache");
});*/

/*Search Users */

router.get('/', function(req, res) {
	console.log('reached search user '+req.query);
	
	var queryParam = req.query;
	var search=req.query.searchOption;
	var query=req.query.query;
	
	if (search !==null && query!==null){
		if (search==="user"){
			var name=query;
			/* MemcacheClient.get(name, function(err, foundUser) {
	                if (!err) {
	                        // Key found, display value
	                	res.render('searchUser', {
		                	foundUser: foundUser
		                });
	                }
	                else {*/
	users.find({firstName: {$regex: new RegExp('^' + name, 'i')}},function(err,foundUser){
					   console.log(foundUser);
				        if (err) {
				            console.log(err);
				            console.log(foundUser);
				            res.redirect('index',{
				                message:null,
				                err: 'Cannot find user'
				            });
				        }
				        else {
				        	if(foundUser){	
				        		/*for (var i=0; i<foundUser.length;i++){
				        		MemcacheClient.set(foundUser[i].firstName, foundUser[i], { flags: 0, exptime: 60}, function(err, status) {
                                    if (!err) {
                                            console.log("Got from Memcache"+foundUser);
                                    }
                                    else {
                                            console.log("Couldn't store key="+query.id+", error="+err);
                                    }
                            });
				        		}*/
				                res.render('searchUser', {
				                	foundUser: foundUser
				                });}
				        	else
				        		{res.redirect('back');}
				           
				        }
				   });
	}
			 
		/* });
		}*/
		else if(search==="company"){
			var companyName = query;
			console.log(companyName);
			
			companys.find(
					   {
						   //name: { $regex: '/^company2/i'} 
						   name: {$regex: new RegExp('^' + companyName, 'i')}
						   //name: { $regex: '/^'+ companyName+ '/'}
						   },function(err,foundCompany){
							   console.log(foundCompany);
							   if (err) {
						            console.log(err);
						            res.render('index',{
						                message:null,
						                err: 'Cannot find user'
						            });
						        }
						        else {
						        		if (foundCompany){
						                res.render('searchCompanys', {
						                	foundCompany: foundCompany
						                });}
						        		else
						        		{res.redirect('back');}
						           
						        }
						   });
			
		}
		
		else if(search==="job"){
			var jobPosition = query;
			console.log("jobPosition "+jobPosition);
			jobs.find(
					   {
						   position: {$regex: new RegExp('^' + jobPosition, 'i')}
					   
						   },function(err,foundJob){
						        if (err) {
						            console.log(err);
						            res.render('index',{
						                message:null,
						                errMsg: 'Cannot find user'
						            });
						        }
						        else {
						        	if(foundJob){
						                res.render('searchJobs', {
						                	jobList: foundJob,errMsg:''
						                });}
						        	else{res.redirect('back');}
						           
						        }
						   });
			
		}
		else{res.send({msg:"back"});}
		
	}
	else{res.redirect('back');}
	
	

});

/*Search Company */
router.get('/company/:name', function(req, res) {
//console.log('reached search company');
	
	var companyName = req.params.name;
	console.log(companyName);
	
	companys.find(
			   {
				   //name: { $regex: '/^company2/i'} 
				   name: {$regex: new RegExp('^' + companyName, 'i')}
				   //name: { $regex: '/^'+ companyName+ '/'}
				   },function(err,foundCompany){
					   console.log(foundCompany);
					   if (err) {
				            console.log(err);
				            res.render('index',{
				                message:null,
				                err: 'Cannot find user'
				            });
				        }
				        else {
				           
				                res.render('viewCompanys', {
				                	foundCompany: foundCompany
				                });
				           
				        }
				   });
	

});

/*Search Job */
router.get('/job/:position', function(req, res) {
	var jobPosition = req.params.position;
	console.log("jobPosition "+jobPosition);
	jobs.find(
			   {
				   position: {$regex: new RegExp('^' + jobPosition, 'i')}
			   
				   },function(err,foundJob){
				        if (err) {
				            console.log(err);
				            res.render('index',{
				                message:null,
				                err: 'Cannot find user'
				            });
				        }
				        else {
				           
				                res.render('viewJobs', {
				                	foundJob: foundJob
				                });
				           
				        }
				   });

});


module.exports = router;
