var express = require('express');
var router = express.Router();
var path = require('path');
var User = require('../models/user');
var CompanyModel = require('../models/company');
var Job = require('../models/job');
var loginmodel = require('../models/login');
var mysqlConnection = require('./mySqlConnection');
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


var sessForValidation;

var sessVar;
var newCompany;
var newUser;
var sessForValidation12;




//function to check login details from rds login table
function CheckInRds(callback){
	console.log("In checkValidationMethod of index file");
	console.log('sessForValidation type:: '+sessForValidation.type);
	console.log(sessForValidation.email);
	console.log(sessForValidation.pswd);

	
	var Login = loginmodel.login.build();
	
	Login.checKforLogin(sessForValidation.email,sessForValidation.type,sessForValidation.pswd,function(userReturned){
		console.log(userReturned.length);
		if(userReturned.length!==0)
			{
				
				console.log('user exists in rds-Login table!');
				console.log(userReturned[0].id);
				return callback(userReturned); 


			}
		
		else
		{
				console.log('user doesnt exist');
				return callback(0);  
			

		}


}, function(error) {
	res.send(error);
		    });
		
	}


//function to store details of new user in mongo after rds
function StoreinUserM(id,callback){
	console.log("In MethDDs "+id +'firstname is' );
	console.log('imporanttttt'+sessVar.Id);
	console.log(sessVar.firstName);
	console.log(sessVar.lastName);
	console.log("In Method again" +id);
	var user_id_str = id;
	
  newUser = new User ({
      userId : id,
      firstName : sessVar.firstName,
      lastName : sessVar.lastName,
      imageUrl: sessVar.imageUrl});
  
  console.log('in mongo save::'+newUser.userId);
	console.log('in mongo save::'+newUser.firstName);
	console.log('in mongo save'+newUser.lastName);
	console.log('in mongo save'+newUser.imageUrl);
	console.log('obj::'+newUser);

	newUser.save(function (err, newUser) {
	
  	console.log('in mongo save');
  if (err){
      console.log(err);
      return callback(newUser);     
  }
  else {
  	console.log('in mongo save success else');
  	rUser=newUser;
  	 return callback(newUser);
  }
});
		
	}
//function ends

//function to store C in mongo on signup
function StoreinCompanyM(id,callback){
	console.log("In MethDDs "+id);
	console.log('imporanttttt'+sessVar.Id);
	console.log(sessVar.email);
	console.log(sessVar.companyName);
	console.log(sessVar.description);
	console.log("In Method again" +id);
	var companyId_str = id;
	
	 newCompany = new Company ({
	        companyId : companyId_str,
	        email: sessVar.email,
	        name : sessVar.companyName,
	        description : sessVar.description,
	        imageUrl: sessVar.imageUrl
	    });
    
    console.log('in mongo save::'+newCompany.companyId);
	console.log('in mongo save::'+newCompany.email);
	console.log('in mongo save'+newCompany.name);
	console.log('in mongo save'+newCompany.imageUrl);
	console.log('obj::'+newCompany);
	

	
	newCompany.save(function (err, newCompany) {
	
    	console.log('in mongo save');
    if (err){
        console.log(err);
        return callback(newCompany);
        
        
    }
    else {
    	console.log('in mongo save success else');
    	
    	 return callback(newCompany);
    }
});
		
	}

/* GET home page. */
router.get('/index', function(req, res) {
    res.render('index',{
        message:null,
        err: null
    });
});

router.get('/', function(req, res) {
    res.render('index',{
        message:null,
        err: null
    });
});

router.get('/login', function(req, res) {
    res.render('login',{
        message:null,
        err: null
    });
});

//Handles post for login for both company and user.Sets session MyID
router.post('/login', function(req, res) {
	console.log('in corect method');
	console.log(req.body.inputEmail);
	console.log(req.body.inputSchool);
	console.log(req.body.inlineRadioOptions);
	
	sessForValidation=req.session;
	sessForValidation.email=req.body.inputEmail;
	
	//var hash = bcrypt.hashSync(req.body.inputSchool);
	
	sessForValidation.pswd=req.body.inputSchool;
	
	if(req.body.inlineRadioOptions=='option1')
		{
		sessForValidation.type='Jb';
		}
	else
		{
		sessForValidation.type='C';
		}
	
	
	//call checkforvalidation 
	CheckInRds(function(user) {
		
		console.log(user);
		//console.log(user.length);
		if(user!==0) // user exists
			{
			console.log('I am userId'+user[0].id);
			sessForValidation.id=user[0].id; // setting id in session field
			req.session.MyID=user[0].id;
			console.log('i am the session key' + req.session.MyID);
			//req.session.afterLogin=sessForValidation;
			if(sessForValidation.type=='Jb'){ //user if of job applicant type
				console.log('hi i am in here');
				  User.findOne({userId:user[0].id},function(err,foundUser){
				        if (err||foundUser==null) {
				            console.log(err);
				           
				            res.render('index',{
				                message:null,
				                err: 'Cannot find user'
				            });
				        }
				        else {
				        	console.log('in the else');
				        	console.log('printing user'+foundUser);
				        	res.redirect('/user/'+user[0].id+'/home');

				        }
				    });
											 }
			else{ // user is of type company
				Company.findOne({companyId:user[0].id},function(err,foundCompany){
			        if (err||foundCompany==null) {
			            console.log(err);
			            //res.redirect('/login');
			            res.render('index',{
			                message:null,
			                err: 'Cannot find company'
			            })
			        }
			        else {
			        	res.redirect('/company/'+user[0].id+'/home');

			        }
			    });
				
			}
			}
		else{
			 //res.redirect('/login');
			 res.render('index',{
	                message:null,
	                err: 'Cannot find you!'
	            });
		}
	
          
     								});
	//
	
});


router.get('/signupUser',function(req,res){
	console.log()
    res.render('user_signup_form',{
        message:null,
        err: null,
        next_page:null
    });
});
// place here code for signupUser post.

router.post('/signupUser',function(req,res){
	var emailinput=req.body.inputEmail;
	var id;
	var firstName=req.body.inputFirstName;
    var lastName=req.body.inputLastName;
    var email=req.body.inputEmail;
    var Login;
    var imageUrl = 'https://s3.amazonaws.com/mini-linkedin/no_img.png';
	console.log("in post method of sign up page");
	console.log('user password is::'+req.body.inputPassword);
	
	//var hash = bcrypt.hashSync(req.body.inputPassword);
	
	//console.log('hashed version is' + hash);
	
	//sessioncode
	sessVar=req.session; // getting the session var first time
	sessVar.firstName=firstName;
	sessVar.lastName=lastName;
	sessVar.email=email;
	sessVar.type='Jb';
	req.session.tYpE='Jb';
	
	Login = loginmodel.login.build({
		userType:'Jb',
		email:emailinput,
		password:req.body.inputPassword
		
								  });
	
	Login.retrieveByEmail(emailinput,function(userReturned){
			console.log(userReturned.length);
			if(userReturned.length!==0)
				{
					console.log('user exists in rds-Login table!');
					console.log(userReturned[0].email);

					res.render('user_signup_form',{
	                message: null,
	                err: "user with this EMAIL exists!",
	                next_page: null
												  });
				}
			
			else
			{
					console.log('Build login model');
					Login.add(function(success) {
					console.log('saved in rds');
					Login.retrieveByEmail(email,function(userReturned){
						console.log('userid returned : '+ userReturned[0].id);
						id=userReturned[0].id;
						// mongo code
					    
					    console.log('after useruser::'+ id);
					    sessVar.Id = id;
					    sessVar.imageUrl=imageUrl;
					    //calling fucn to store details in mongo
					    StoreinUserM(id, function(user) {
					    	console.log('inside method calling::'+id);
			        		if (user){
			        			sessVar.user=user; // adding to session here.
			        			sessVar.userType='Jb';
			        			req.session.MyID=id;
			        			res.redirect('/user/'+id+'/home');
//			        			res.render('user_home',{
//				                    connection_count: '100',
//				                    User: user});
			        		}
			        		else
			        			{
			        		  res.render('user_signup_form',{
			                  message: "Some error try again!",
			                  err: null,
			                  next_page: "Go back home"
			        			});
			        			}
			        		
			                 
			            								});

						//
						
						}, function(error) {
						console.log('error in retreival from rds after insertion');	
					});
												}, function(error) {
					console.log('error in rds submission');
																	});
				

			}


	}, function(error) {
		//res.send(error);
			    });
	
	});

// user sign up ends

router.get('/signupComp',function(req,res){
    res.render('company_signup_form',{
        message:null,
        err: null,
        next_page:null
    });
});

// code for post of company sign up

router.post('/signupComp',function(req,res){
	// getting the inputs from ui
	var id;
    var email = req.body.email;
    var name = req.body.compName;
    var imageUrl = 'https://s3.amazonaws.com/mini-linkedin/company_default.png';
    var description = req.body.inputDesc;
    var password = req.body.inputSchool;
    
    //var hash = bcrypt.hashSync(password);
    console.log('in post method of company signup');
    
    sessVar=req.session; // getting the session var first time
    
    sessVar.email=email;
    sessVar.companyName = name;
    sessVar.description = description;
    sessVar.imageUrl=imageUrl;
    sessVar.type='C';
    req.session.tYpE='C';
    //making mysql model for login table
    var Login = loginmodel.login.build({
		userType:'C',
		email:email,
		password:req.body.inputSchool
		
								  });
    
    Login.retrieveByEmail(email,function(userReturned){
		console.log(userReturned.length);
		if(userReturned.length!==0)
			{
				console.log('company exists in rds-Login table!');
				console.log(userReturned[0].email);

				res.render('company_signup_form',{
                message: null,
                err: "company with this EMAIL exists!",
                next_page: null
											  });
			}
		
		else
		{
				console.log('Build login model');
				Login.add(function(success) {
				console.log('saved in rds');
				Login.retrieveByEmail(email,function(userReturned){
					console.log('userid returned : '+ userReturned[0].id);
					id=userReturned[0].id;
					// mongo code
				    
				    console.log('after useruser::'+ id);
				    sessVar.Id = id;
				    // storing in mongo and redirecting to company home page
				    StoreinCompanyM(id, function(company) {
				    	console.log('inside method calling::'+id);
		        		if (company){
		        			sessVar.user=company; // adding to session here.
		        			sessVar.userType='C';
		        			req.session.MyID=id;
		        			
		        			res.redirect('/company/'+id+'/home')
//		        			res.render('company_home',{
//			                    connection_count: '100',
//			                    Company: company});
		        		}
		        		else
		        			{
		        		  res.render('company_signup_form',{
		                  message: "Some error try again!",
		                  err: null,
		                  next_page: "Go back home"
		        			});
		        			}
		        		
		                 
		            								});

					//
					
					}, function(error) {
					console.log('error in retreival from rds after insertion');	
				});
											}, function(error) {
				console.log('error in rds submission');
																});
			

		}


}, function(error) {
	//res.send(error);
		    });

})
// code ends here

module.exports = router;
