var express = require('express');
var router = express.Router();
var chance = require('chance').Chance();
var User = require('../models/user');
var Company = require('../models/company');
var Job = require('../models/job');
var UserRecommend = require('../models/UserRecommend');
var CareerRecommend = require('../models/CareerRecommend');
var JobRecommend = require('../models/JobRecommend');
var LookupJob = require('../models/LookupJob');
var model = require('../models/followUser');
var followCompanyModel = require('../models/followCompany');
var loginmodel = require('../models/login');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var multer = require('multer');
var sessVar;
var client = require('../models/s3');
var s3 = require('s3');
var myMulter = multer({
    dest: './uploads/',
    rename: function (fieldname, filename) {
        file_name = filename.replace(/\W+/g, '-').toLowerCase();
        return file_name;
    }
});

var sessVar;
var newUser;
var sessForValidation12;
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

router.get('/profile', function (req, res) {
    console.log('reached route');
    var mySesn = req.session.MyID;
    res.redirect('/user/'+mySesn);
});

router.get('/', function (req, res) {
    console.log('reached route');
    var mySesn = req.session.MyID;
    res.redirect('/user/'+mySesn+'/home');
});

router.post('/',function(req,res){
    var user_id_str = chance.natural({min: 1, max: 100000}).toString();
    var newUser = new User ({
        userId : user_id_str,
        firstName : req.body.inputFirstName,
        lastName : req.body.inputLastName});
    newUser.save(function (err, newUser) {
        if (err){
            console.log(err);
            res.render('user_signup_form',{
                message: null,
                err: "Cannot create new user",
                next_page: null
            });
        }
        else {
            res.render('user_signup_form',{
                message: "Congratulation! User profile is created",
                err: null,
                next_page: "Go back home"
            });
        }
    });
});

router.param('user_id', function(req, res, next, user_id) {
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    var mySesn = req.session.MyID;
    console.log('it works');
    console.log('sessionnnnn checkkk'+mySesn);
    // var user_id = req.params.user_id;
    console.log('user param is'+user_id);

    if(req.session)
    {
        if(!mySesn || mySesn.toString()==='undefined'|| mySesn.toString()!==user_id)
        {
            console.log('u r trapped, my friend');
            return res.redirect('/login');
        }
    }
    else
    {console.log('u r trapped, my friend');
        return res.redirect('/login');}

    // continue doing what we were doing and go to the route
    next();
});

router.get('/:user_id/home',function(req,res){

    var userId=req.params.user_id;
    User.findOne({userId:userId},function(err,foundUser){
        if (err) {
            console.log(err);
            res.render('index',{
                message:null,
                err: 'Cannot find user'
            });
        }
        else {
            var followUser = model.FollowUser.build();
            var followCompanyHandler= followCompanyModel.FollowCompany.build();
            followUser.retrieveCoutByUserId(userId,function(connCount) {
                if (connCount) {
                    console.log(connCount);
                    console.log('Got model');
                    var fComapanyList = [];
                    followCompanyHandler.retrieveByUserId(userId,function(followCompanyResult) {
                        if (followCompanyResult) {
                            console.log(followCompanyResult);
                            console.log("Reahing Series");
                            function series(i) {
                                console.log("followCompanys.length "+followCompanyResult.length);
                                if(i<followCompanyResult.length) {
                                    console.log("Reahed If+ Series "+i+" "+followCompanyResult[i]);
                                    getFCompaniesSeries( followCompanyResult[i], function(foundCompanies) {
                                        if (foundCompanies){
                                            //var index = foundCompanies.status.length;
                                            fComapanyList.push(foundCompanies);}
                                        series(i+1);
                                    });
                                } else {
                                    console.log("$$$$$$$$$$connectionList "+fComapanyList);
                                    //return res.render('viewEditConnections',{fComapanyList:fComapanyList,userId:userId});
                                    //return res.render('index',{jobList:jobList});
                                    //return res.send({fComapanyList:fComapanyList,userId:userId});
                                    res.render('user_home',{
                                        connection_count: connCount,
                                        fComapanyList:fComapanyList,
                                        User: foundUser
                                    });

                                }
                            }
                            //jobsApplied.forEach(function(obj) {
                            series(0);

                        } else {
                            res.render('user_home',{
                                connection_count: 0,
                                fComapanyList:[],
                                User: foundUser
                            });
                        }
                    }, function(error) {
                        res.send(error);
                    });
                    //res.send({'connCount':connCount});


                } else {
                    //no followers  but may have companies

                    var fComapanyList = [];
                    followCompanyHandler.retrieveByUserId(userId,function(followCompanyResult) {
                        if (followCompanyResult) {
                            console.log(followCompanyResult);
                            console.log("Reahing Series");
                            function series(i) {
                                console.log("followCompanys.length "+followCompanyResult.length);
                                if(i<followCompanyResult.length) {
                                    console.log("Reahed If+ Series "+i+" "+followCompanyResult[i]);
                                    getFCompaniesSeries( followCompanyResult[i], function(foundCompanies) {
                                        if (foundCompanies){
                                            //var index = foundCompanies.status.length;
                                            fComapanyList.push(foundCompanies);}
                                        series(i+1);
                                    });
                                } else {
                                    console.log("$$$$$$$$$$connectionList "+fComapanyList);
                                    //return res.render('viewEditConnections',{fComapanyList:fComapanyList,userId:userId});
                                    //return res.render('index',{jobList:jobList});
                                    //return res.send({fComapanyList:fComapanyList,userId:userId});
                                    res.render('user_home',{
                                        connection_count: connCount,
                                        fComapanyList:fComapanyList,
                                        User: foundUser
                                    });

                                }
                            }
                            //jobsApplied.forEach(function(obj) {
                            series(0);

                        } else {
                            res.render('user_home',{
                                connection_count: 0,
                                fComapanyList:[],
                                User: foundUser
                            });
                        }
                    }, function(error) {
                        res.send(error);
                    });
                }
            }, function(error) {
                res.send(error);
            });

        }
    });
});


router.get('/:user_id', function (req, res) {
    var user_id = req.params.user_id;
    if (user_id < 0) {
        res.status(404).send('Invalid company id');
    }
    User.findOne({userId:user_id},function(err,foundUser){
        if (err || foundUser===null) {
            console.log(" router get userId"+err);
            res.render('index',{
                message:null,
                err: 'Cannot find user'
            })
        }
        else {
            console.log(foundUser.skill1);
            console.log(foundUser.company1);
            console.log(foundUser.position1);
            res.render('user',{
                User: foundUser});
        }
    });
});

router.get('/:user_id/recommendJob',function(req,res){
    JobRecommend.find({userId:req.params.user_id},function(err,result) {
        if (err) {
            console.log(err);
            res.render('recommendJobs', {
                jobList: null,
                result: null
            })
        }
        else {
            if (result.length==0){
                res.render('recommendJobs', {
                    jobList: null,
                    result: null
                })
            }
            else {
                console.log("result: " + result);
                var rec1 = result[0].jobId;
                var rec2 = result[1].jobId;
                var rec3 = result[2].jobId;

                Job.find({'$or': [{jobId: rec1}, {jobId: rec2}, {jobId: rec3}]}, function (err, jobList) {
                    if (err) {
                        console.log(err);
                        res.render('recommendJobs', {
                            jobList: null,
                            result: null
                        })
                    }
                    else {
                        console.log("Recommend jobs: " + jobList);
                        res.render('recommendJobs', {
                            jobList: jobList,
                            result: result
                        })
                    }
                });
            }
        }
    });
    //User.findOne({userId:req.params.user_id},function(err,foundUser) {
    //    if (err) {
    //        console.log(err);
    //        res.render('index', {
    //            User: foundUser,
    //            message: null,
    //            err: 'Cannot find user'
    //        })
    //    }
    //    else {
    //        res.render('recommendJobs', {
    //            User: foundUser,
    //            message: null,
    //            err: null
    //        })
    //    }
    //});
});

router.get('/:user_id/test',function(req,res){
    console.log("Testing");
    var recommend = new UserRecommend({
        userId: req.params.user_id,
        jobId: 15
    });
    recommend.save(function(err,res){
        if (err) {
            console.log(err);
        }
        else{
            console.log(res);
        }
    })
});

router.get('/:user_id/recommendUser',function(req,res) {
    var recommend_user_list = [];
    UserRecommend.find({userId: req.params.user_id}, function (err, result) {
        if (err) {
            console.log(err);
            res.render('recommendUsers', {
                result: null,
                foundUser: null
            })
        }
        else {
            if (result.length == 0) {
                res.render('recommendUsers', {
                    result: null,
                    foundUser: null
                });
            }
            else {
                console.log("result: " + result);
                var rec1 = result[0].recommendId;
                var rec2 = result[1].recommendId;
                var rec3 = result[2].recommendId;
                User.find({'$or': [{userId: rec1}, {userId: rec2}, {userId: rec3}]}, function (err, foundUser) {
                    if (err) {
                        console.log(err);
                        res.render('recommendUsers', {
                            foundUser: null,
                            result : null
                        })
                    }
                    else {
                        console.log("Recommend users: " + foundUser);
                        res.render('recommendUsers', {
                            foundUser: foundUser,
                            result: result
                        })
                    }
                });
            }
        }
    });
});

//router.get('/:user_id/test',function(req,res){
//    console.log("Testing");
//    var recommend = new JobRecommend({
//        position1: 0,
//        position2: "test",
//        position3: "test",
//        position4: "test"
//    });
//    recommend.save(function(err,res){
//        if (err) {
//            console.log(err);
//        }
//        else{
//            console.log(res);
//        }
//    })
//});

router.get('/:user_id/recommendCareer',function(req,res){
    console.log("recommend career");
    User.findOne({userId:req.params.user_id},function(err,foundUser) {
        if (err) {
            console.log(err);
        }
        else{
            console.log("headline id: " + foundUser.headlineId);
            CareerRecommend.find({'$or':[{pid1: foundUser.headlineId},{pid2: foundUser.headlineId},{pid3: foundUser.headlineId},{pid4: foundUser.headlineId}]},function(err,foundRec){
                if(err){
                    console.log(err);
                    res.render('career_path',{
                        foundRec : null,
                        foundUser : foundUser
                    })
                }
                else{
                    console.log(foundRec);
                    res.render('career_path',{
                        foundRec : foundRec,
                        foundUser : foundUser
                    })
                }
            });
        }
    });
});

router.get('/:user_id/edit_profile',function (req, res) {
    User.findOne({userId:req.params.user_id}, function (err, foundUser) {
        if (err) {
            console.log("Error in finding user "+err);
            if (err) {
                res.render('index',{
                    message:null,
                    err: 'Cannot find user'
                });
            }
        }
        else {
            console.log("User.imageUrl "+foundUser.imageUrl);
            console.log("User.headline "+foundUser.headline);
            res.render('edit_profile',{
                user_id: req.params.user_id,User:foundUser
            });
        }
    });

});

router.post('/:user_id/edit_profile',myMulter, function (req, res) {
    var user_id = req.params.user_id;
    var link='';
    console.log("req.files.imageUrl "+req.files.imageUrl);
    console.log("req.body.imageUrlHidden "+req.body.imageUrlHidden);
    console.log("req.body.headlineId "+req.body.headlineId);
    console.log("req.body.skillOneId "+req.body.skillOneId);
    console.log("req.body.skillTwoId "+req.body.skillTwoId);
    console.log("req.body.skillThreeId "+req.body.skillThreeId);
    //  if (req.body.imageUrlHidden)  {link=req.body.imageUrlHidden}
    //else{
    if (req.files.imageUrl){
        console.log(" file "+req.files.imageUrl.name);
        var file_name = req.files.imageUrl.name;
        /*  if (file_name.type != 'image/png' && file_name.type != 'image/jpeg'){
         console.log('Not image file');
         return res.redirect('/user/'+user_id+'/edit_profile');
         }*/
        var upload_dir = ('./uploads/'+ file_name);
        console.log(upload_dir);
        var params = {
            //localFile: "/Users/sophiango/Downloads/icon.jpg",
            localFile: upload_dir,

            s3Params: {
                Bucket: "mini-linkedin",
                Key: file_name
                // other options supported by putObject, except Body and ContentLength.
                // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
            }
        };
        var uploader = client.uploadFile(params);
        uploader.on('error', function(err) {
            console.error("unable to upload:", err.stack);
        });
        uploader.on('progress', function() {
            console.log("progress", uploader.progressMd5Amount,
                uploader.progressAmount, uploader.progressTotal);
        });
        uploader.on('end', function() {
            console.log("done uploading");
        });

        link = s3.getPublicUrl('mini-linkedin', file_name ,'us-east-1');
        console.log(link);
    }
    else{link=req.body.imageUrlHidden;}

    console.log("link "+link);
    User.update({userId:user_id},{$set: {
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            imageUrl : link,
            skill1 : req.body.skill1,
            skill2 : req.body.skill2,
            skill3 : req.body.skill3,
            location : req.body.location,
            locaionId : req.body.locationId
        }},
        function(err,foundUser){
            if (err) {
                console.log(err);
                res.render('index',{
                    message:null,
                    err: 'Cannot edit user'
                });
            }
            else{
                User.findOne({userId:req.params.user_id}, function (err, foundUser) {
                    if (err) {
                        console.log(err);
                        if (err) {
                            res.render('index',{
                                message:null,
                                err: 'Cannot find user'
                            });
                        }
                    }
                    else {console.log("From edit profile");
                        res.redirect('/user/'+user_id);
                    }
                });
            }
        });
});

router.post('/:user_id/exp',function (req, res) {
    var userId=req.params.user_id;
    User.findOne({userId:userId},function(err,foundUser) {
        if (err) {
            console.log(err);
            res.render('index',{
                message:null,
                err: 'Cannot find user'
            })
        }
        else {
            var cnt= foundUser.experience.length;
            console.log("Reached add ");
            console.log("Cnt "+cnt);
            foundUser.experience.push({
                position: req.body.inputPosition,
                company: req.body.inputCompany,
                from: req.body.inputFrom,
                to: req.body.inputTo,
                description: req.body.inputDesc
            });
            foundUser.save(function (err) {
                if (err) {
                    console.log(err);
                    res.render('add_new_exp',{
                        user_id: User.userId,
                        message:null,
                        err: "Cannot add new experience"
                    })
                }
                else{
                    /* res.render('add_new_exp',{
                     user_id: User.userId,
                     message:"Successfully added an experience. You can add more experience or go back to your profile",
                     err: null
                     })*/
                    res.redirect('/user/'+userId);
                }
            });
        }
    });
});

router.get('/:user_id/exp',function (req, res) {
    res.render('add_new_exp',{
        user_id: req.params.user_id,
        message:null,
        err:null
    })
});

router.get('/:user_id/edit_exp',function (req, res) {
    User.findOne({userId:req.params.user_id},function(err,foundUser){
        if (err) {
            console.log(err);
            res.render('index',{
                message:null,
                err: 'Cannot find user'
            })
        }
        else {
           
                res.render('add_new_exp', {
                	User: foundUser,
                    message: null,
                    err: null
                })
        }
    });
});

router.post('/:user_id/edit_exp', function (req, res) {
	 console.log("Reached post exp ");
	 var posiCnt=0;
	 var headline="";
	 var headlineId=0;
    var user_id = req.params.user_id;
    console.log("req "+user_id);
    var company1=req.body.company1;
    var position1=req.body.position1;
    if (position1)
    	{posiCnt=1;
    	}
    var cid1=req.body.cid1;
    var pid1=req.body.pid1;
    console.log("reac 1");
    var company2=req.body.company2;
    var position2=req.body.position2;
    if (position2)
	{posiCnt=2;}
    var cid2=req.body.cid2;
    var pid2=req.body.pid2;
    console.log("reac 2");
    var company3=req.body.company3;
    var position3=req.body.position3;
    if (position3)
	{posiCnt=3;}
    var cid3=req.body.cid3;
    var pid3=req.body.pid3;
    console.log("reac 3");
    var company4=req.body.company4;
    var position4=req.body.position4;
    if (position4)
	{posiCnt=4;}
    var cid4=req.body.cid4;
    var pid4=req.body.pid4;
    console.log("reac 4");
    console.log("cid4 "+company4);
    console.log("pid4 "+position4);
    switch(posiCnt) {
    case 1:
    	headline=position1;
    	headlineId=pid1;
        break;
    case 2:
    	headline=position2;
    	headlineId=pid2;
        break;
    case 3:
    	headline=position3;
    	headlineId=pid3;
        break;
    case 4:
    	headline=position4;
    	headlineId=pid4;
        break;
    default:         
        headline="";
	    headlineId=0;
} 
    
    return User.findOne({userId: req.params.user_id}, function (err, foundUser) {
        foundUser.company1= company1;
        foundUser.position1= position1;
        foundUser.cid1= cid1;
        foundUser.pid1= pid1;
        foundUser.company2= company2;
        foundUser.position2=position2;
        foundUser.cid2= cid2;
        foundUser.pid2= pid2;
        foundUser.company3= company3;
        foundUser.position3=position3;
        foundUser.cid3= cid3;
        foundUser.pid3= pid3;
        foundUser.company4= company4;
        foundUser.position4=position4;
        foundUser.cid4= cid4;
        foundUser.pid4= pid4;
        foundUser.headline= headline;
        foundUser.headlineId= headlineId;
        return foundUser.save(function (err) {
            if (!err) {
                /* res.render('user', {
                 connection_count: '100',
                 User: foundUser
                 });*/
                res.redirect('/user/'+user_id);
            } else {
                console.log(err);
            }
        });
    });
});

router.post('/:user_id/edu',function (req, res) {
    var userId=req.params.user_id;
    User.findOne({userId:userId},function(err,foundUser) {
        if (err) {
            console.log(err);
            res.render('index',{
                message:null,
                err: 'Cannot find user'
            })
        }
        else {
            var cnt= foundUser.education.length;
            console.log("Reached add ");
            console.log("Cnt "+cnt);
            foundUser.education.push({
                id:cnt+1,
                institution: req.body.inputSchool,
                degree: req.body.inputDegree,
                fromYear: req.body.inputFrom,
                toYear: req.body.inputTo
            });
            foundUser.save(function (err) {
                if (err) {
                    res.render('add_new_edu',{
                        user_id: User.userId,
                        message:null,
                        err: "Cannot add new institution"
                    })


                }
                else{
                    /*res.render('add_new_edu',{
                     user_id: User.userId,
                     message:"Successfully added an institution. You can add more institution or go back to your profile",
                     err: null
                     })*/
                    res.redirect('/user/'+userId);
                }
            });
        }
    });
});

router.get('/:user_id/edu',function (req, res) {
    res.render('add_new_edu',{
        user_id: req.params.user_id,
        message:null,
        err:null
    })
});

router.get('/:user_id/edit_edu',function (req, res) {
    User.findOne({userId:req.params.user_id},function(err,foundUser){
        if (err) {
            console.log(" router get edit_edu "+err);
            res.render('index',{
                message:null,
                err: 'Cannot find user'
            })
        }
        else {
            
                res.render('add_new_edu', {
                    User: foundUser,
                    message: null,
                    err: null
                })
            
        }
    });
});

router.post('/:user_id/edit_edu', function (req, res) {
    console.log("Re body "+req.body.inputDegree);
    var user_id = req.params.user_id;
    User.findOne({userId: req.params.user_id}, function (err, foundUser) {
        foundUser.education= req.body.inputSchool;
        foundUser.save(function (err) {
            if (!err) {
                res.redirect('/user/'+user_id);

            } else {
                console.log(err);
                res.render('index',{
                    message:null,
                    err: 'Cannot edit education'
                })
            }
        });
    });
});

router.post('/:user_id/del', function (req, res) {
    var user_id = req.params.user_id;
    if (user_id < 0){
        res.status(404).send('Invalid company id or job id');
    }
    User.remove({userId:user_id},function(err) {
        if (err) {
            console.log(err);
            res.render('index',{
                message:null,
                err: 'Cannot delete user'
            })
        }
        else {
            res.render('index',{
                message:"Successfully delete user profile",
                err: null
            })
        };
    })
});

//router.get('/:user_id/company/:comp_id', function (req, res) {
//    var comp_id = req.params.comp_id;
//    if (comp_id < 0) {
//        res.status(404).send('Invalid company id');
//    }
//    Company.findOne({companyId:comp_id},function(err,foundCompany){
//        if (err) {
//            console.log(err);
//            res.render('index',{
//                message:null,
//                err: 'Cannot find user'
//            })
//        }
//        else {
//            res.render('company',{
//                Company: foundCompany
//            })
//            //res.status(200).send('Successfully get a company ' + comp_id);
//        }
//    })
//});
//
//router.post('/:user_id/company/',function(req,res){
//    var companyId_str = chance.natural({min: 1, max: 100000}).toString();
//    //company_id = (company_id + 1);
//    //var companyId_str = company_id.toString();
//    var newCompany = new Company ({
//        companyId : companyId_str,
//        name : req.body.inputCompanyName,
//        imageUrl : req.body.imageUrl,
//        subLine : req.body.inputCompanyDesc
//    })
//    console.log(newCompany);
//    //newCompany.save(function (err, data) {
//    //    if (err) console.log(err);
//    //    else {
//    //        console.log('Saved : ', data );
//    //        res.status(201).send('Successfully created a company');
//    //    }
//    //});
//});
//
//router.put('/:user_id/company/:comp_id', function (req, res) {
//    var comp_id = req.params.comp_id;
//    newName = req.body.name;
//    newImageUrl = req.body.imageUrl;
//    newSubLine = req.body.subLine;
//    Company.update({companyId:comp_id},{$set:{name:newName,imageUrl:newImageUrl,subLine:newSubLine}},
//        function(err,updatedJob){
//            if (err) console.log(err);
//            res.status(200).send('Successfully update a job');
//        })
//});
//
//router.delete('/:user_id/company/:comp_id', function (req, res) {
//    var comp_id = req.params.comp_id;
//    var delete_in_company = false;
//    var delete_in_job = false;
//    if (comp_id < 0){
//        res.status(404).send('Invalid company id or job id');
//    }
//    Company.remove({companyId:comp_id},function(err) {
//        if (err) console.log(err);
//        else delete_in_company = true;
//        Job.remove({companyId:comp_id},function(err) {
//            if (err) console.log(err);
//            else delete_in_job = true;
//            if (delete_in_company && delete_in_job){
//                res.status(204).send('Successfully delete company');
//            }
//        })
//    })
//});
//
//router.post('/:user_id/company/:comp_id/job', function (req, res) {
//    var comp_id = req.params.comp_id;
//    if (comp_id < 0) {
//        res.status(404).send('Invalid company id');
//    }
//    var jobId = chance.natural({min: 1, max: 10000}).toString();
//    var position = req.body.position;
//    var description = req.body.description;
//    var location = req.body.location;
//    Company.findOne({companyId:comp_id},function(err,foundCompany){
//        if (err) console.log(err);
//        else {
//            company_name = foundCompany.name;
//            var newJob = new Job ({
//                jobId : jobId,
//                companyId : comp_id,
//                company : company_name,
//                position : position,
//                location: location,
//                description : description
//                //createdAt : Date.now()
//            });
//            newJob.save(function (err) {
//                if (err) console.log(err);
//                else {
//                    res.render();
//                }
//            });
//        }
//    });
//    //new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
//});
//
//router.get('/:user_id/company/:comp_id/job/:job_id', function (req, res) {
//    var comp_id = req.params.comp_id;
//    var job_id = req.params.job_id;
//    if (comp_id < 0 || job_id < 0) {
//        res.status(404).send('Invalid company id');
//    }
//    Job.findOne({jobId:job_id},function(err,foundJob){
//        if (err) console.log(err);
//        else {
//            console.log('Found company: ' + foundJob.position + "," + foundJob.company );
//            res.status(200).send('Successfully get a job ' + job_id );
//        }
//    })
//});
//
//router.put('/:user_id/company/:comp_id/job/:job_id', function (req, res) {
//    var comp_id = req.params.comp_id;
//    var job_id = req.params.job_id;
//    if (comp_id < 0 || job_id < 0) {
//        res.status(404).send('Invalid company id');
//    }
//    newPosition = req.body.position;
//    //newCreateAt = req.body.createAt;
//    newDescription = req.body.description;
//
//    Job.update({jobId:job_id},{$set:{position:newPosition,description:newDescription}},
//        function(err,updatedJob){
//            if (err) console.log(err);
//            else res.status(200).send('Successfully update a job');
//        })
//});
//
//router.delete('/:user_id/company/:comp_id/job/:job_id', function (req, res) {
//    var comp_id = req.params.comp_id;
//    var job_id = req.params.job_id;
//    if (comp_id < 0 || job_id < 0){
//        res.status(404).send('Invalid company id or job id');
//    }
//    Job.remove({jobId:job_id},function(err) {
//        if (err) console.log(err);
//        else res.status(204).send('Successfully deleted a job');
//    })
//});
//
//router.post('/:user_id/status',function(req,res){
//
//});

module.exports = router;
