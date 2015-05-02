var express = require('express');
var router = express.Router();
var chance = require('chance').Chance();
var User = require('../models/user');
var Company = require('../models/company');
var Job = require('../models/job');
var model = require('../models/followCompany');
var loginmodel = require('../models/login');
var companyJob = require('../models/companyJob');
var Id = require('../models/sequence');
var sqlite = require('../database/mysqlSeqlite');
var multer = require('multer');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var sessVar;
var newCompany;

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


/* GET users listing. */
router.get('/', function(req, res) {
    var mySesn = req.session.MyID;
    res.redirect('/company/'+mySesn+'/home');
});




router.post('/',function(req,res){
    var companyId_str = chance.natural({min: 1, max: 100000}).toString();
    //company_id = (company_id + 1);
    //var companyId_str = company_id.toString();
    var newCompany = new Company ({
        companyId : companyId_str,
        email: req.body.email,
        name : req.body.compName,
        imageUrl : req.body.imageUrl,
        description : req.body.inputDesc
    });
    newCompany.save(function (err, data) {
        if (err){
            console.log(err);
            res.render('company_signup_form',{
                message: null,
                err: "Cannot create new company",
                next_page: null
            });
        }
        else {
            res.render('company_signup_form',{
                message: "Congratulation! Company profile is created",
                err: null,
                next_page: "Go back home"
            });
        }
    });
});

//router.put('/:comp_id', function (req, res) {
//    var comp_id = req.params.comp_id;
//    newName = req.body.name;
//    newImageUrl = req.body.imageUrl;
//    newdescription = req.body.description;
//    Company.update({companyId:comp_id},{$set:{name:newName,imageUrl:newImageUrl,description:newdescription}},
//        function(err,updatedJob){
//            if (err) console.log(err);
//            res.status(200).send('Successfully update a job');
//        })
//});

router.param('comp_id', function(req, res, next, comp_id) {
    console.log('it works');
    var mySesn = req.session.MyID;
    console.log('sessionnnnn checkkk'+mySesn);
    //  var user_id = req.params.comp_id;

    console.log('varibaleeee1'+mySesn);

    console.log('varibaleeee2'+comp_id);

    if(!mySesn || mySesn=='undefined'|| mySesn.toString()!==comp_id)
    {
        console.log('u r trapped, my friend');
        res.redirect('/login');
    }

    // continue doing what we were doing and go to the route
    next();
});

router.get('/:comp_id/home', function (req, res) {


    var comp_id = req.params.comp_id;
    Company.findOne({companyId:comp_id},function(err,foundCompany){
        if (err || foundCompany === null) {
            console.log(err);
            res.render('index',{
                message:null,
                err: 'Cannot find company'
            });
        }
        else {
            console.log("Image cmo "+foundCompany.imageUrl);
            console.log(foundCompany.status[0]);
            var followCompany = model.FollowCompany.build();

            console.log('Got model');
            followCompany.retrieveCoutByCompId(comp_id,function(userCount) {
                if (userCount) {
                    console.log(userCount);
                    res.render('company',{
                        count: userCount , // hardcode count
                        Company: foundCompany,
                        comp_id : comp_id
                    });

                } else {
                    res.render('company',{
                        count: 0 , // hardcode count
                        Company: foundCompany,
                        comp_id : comp_id
                    });
                }

            });
        }

    });
});

router.get('/:comp_id', function (req, res) {
    var comp_id = req.params.comp_id;
    if (comp_id < 0) {
        res.status(404).send('Invalid company id');
    }
    Company.findOne({companyId:comp_id},function(err,foundCompany){
        if (err) {
            console.log(err);
        }
        else {
            console.log(foundCompany);
            res.render('company',{
                count: '10k' , // hardcode count
                Company: foundCompany,
                comp_id : comp_id
            })
        }
    })
});


router.get('/:comp_id/edit_profile',function (req, res) {
    console.log("call");
    var comp_id = req.params.comp_id;
    Company.findOne({companyId:comp_id},function(err,foundCompany){
        if (err) {
            console.log(err);
        }
        else {
            res.render('edit_comp_profile',{
                Company:foundCompany
            });
        }
    });
});

router.post('/:comp_id/status',function (req, res) {
    console.log("reached");
    var comp_id = req.params.comp_id;
    var status = req.body.status_input;
    console.log(comp_id +" "+status );
    if (status){
        var	now = new Date();
        Company.update({companyId:comp_id},{$push: {"status": {$each: [{
                textPost : status,
                created_at : now } ],

                // Slice to max of 50 items
                $slice:-50,

                // Sorted by last_updated_at desc
                $sort: {'created_at': -1}
            }}},
            function(err,foundUser){
                if (err) {
                    console.log(err);
                    res.render('index',{
                        message:null,
                        err: 'Cannot edit company'
                    });
                }
                else{
                    res.redirect("/company/"+comp_id+"/home");
                }
            });}
    else{
        res.redirect("/company/:"+comp_id+"/home");
    }
});

router.post('/:comp_id/edit_profile',myMulter, function (req, res) {
    var comp_id = req.params.comp_id;
    var link='';
    if(req.files.imageUrl){
        var file_name = req.files.imageUrl.name;
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
        console.log(link);}
    else{link=req.body.imageUrlHidden;}

    console.log("Body "+req.body.companyName);
    Company.update({companyId:comp_id},{$set: {
            name : req.body.companyName,
            description : req.body.description,
            addressLine1:req.body.addressLine1,
            addressLine2:req.body.addressLine2,
            addressCountry:req.body.addressCountry,
            addressState:req.body.addressState,
            addressCity:req.body.addressCity,
            addressZipCode:req.body.addressZipCode,
            url:req.body.url,
            imageUrl:link,
            email:req.body.email
        }},
        function(err,foundUser){
            if (err) {
                console.log(err);
                res.render('index',{
                    message:null,
                    err: 'Cannot edit company'
                });
            }
            else{  res.redirect("/company/"+comp_id+"/home"); }
        });
});

router.post('/:comp_id/del', function (req, res) {
    var comp_id = req.params.comp_id;
    var delete_in_company = false;
    var delete_in_job = false;
    if (comp_id < 0){
        res.status(404).send('Invalid company id or job id');
    }
    Company.remove({companyId:comp_id},function(err) {
        if (err) console.log(err);
        else delete_in_company = true;
        Job.remove({companyId:comp_id},function(err) {
            if (err) {
                res.render('index',{
                    message: null,
                    err: "cannot delete company"
                })
                console.log(err);
            }
            else {
                res.render('index',{
                    message: "Succesfully delete company",
                    err: null
                })
            }
        })
    })
});

router.post('/:comp_id/job', function (req, res) {
    var comp_id = req.params.comp_id;
    if (comp_id < 0) {
        res.status(404).send('Invalid company id');
    }
    /* var jobId = chance.natural({min: 1, max: 10000}).toString();

     Id.findOneAndUpdate(
     { prefix: "JOB" },
     { $inc:   { count: 1 } },
     { upsert: true },
     function (err, idDoc) {
     console.log("idDoc "+idDoc);
     // callback(err, idDoc);
     });

     console.log("jobId "+jobId);*/
    var position = req.body.position;
    var description = req.body.description;
    var location = req.body.location;
    var expires = req.body.expires;
    console.log("expires "+expires);
    Company.findOne({companyId:comp_id},function(err,foundCompany){
        if (err){ console.log(err);}
        else {
            var company_name = foundCompany.name;
            Id.findOneAndUpdate(
                { prefix: "JOB" },
                { $inc:   { count: 1 } },
                { upsert: true },
                function (err, idDoc) {
                    console.log("idDoc "+idDoc);
                    var newJob = new Job ({
                        jobId : idDoc.count,
                        companyId : comp_id,
                        company : company_name,
                        position : position,
                        location: location,
                        description : description,
                        expires:expires
                        //createdAt : Date.now()
                    });
                    newJob.save(function (err) {
                        if (err) {console.log(err);}
                        else {
                            var companyJobModel = companyJob.CompanyJob.build({
                                jobId : idDoc.count,
                                companyId : comp_id
                            });

                            console.log('Build followCompany');
                            companyJobModel.add(function(success) {
                                res.redirect("/company/"+comp_id+"/home");
                            }, function(err) {
                                res.send(err);
                            });

                        }
                    });
                });

        }
    });
    //new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
});

router.get('/:comp_id/jobPost', function (req, res) {
    var comp_id = req.params.comp_id;

    if (comp_id < 0 ) {
        res.status(404).send('Invalid company id');
    }

    res.render('jobPosting',{companyId:comp_id} );

});

router.get('/:comp_id/job', function (req, res) {
    var comp_id = req.params.comp_id;

    if (comp_id < 0 ) {
        res.status(404).send('Invalid company id');
    }
    Job.find({companyId:comp_id},function(err,foundJob){
        if (err ){ console.log("Error" + err);}
        else {
            console.log('Found company: ' + foundJob );
            res.render('viewPostedJobs',{jobList:foundJob,companyId:comp_id} );
        }
    });
});


router.put('/:comp_id/job/:job_id', function (req, res) {
    var comp_id = req.params.comp_id;
    var job_id = req.params.job_id;
    if (comp_id < 0 || job_id < 0) {
        res.status(404).send('Invalid company id');
    }
    newPosition = req.body.position;
    //newCreateAt = req.body.createAt;
    newDescription = req.body.description;

    Job.update({jobId:job_id},{$set:{position:newPosition,description:newDescription}},
        function(err,updatedJob){
            if (err) console.log(err);
            else res.status(200).send('Successfully update a job');
        })
});

router.post('/:comp_id/delete/job', function (req, res) {
    console.log("/delete/job");
    var comp_id = req.body.companyId;
    var job_id = req.body.jobId;
    console.log("selected: " + job_id);
    if (comp_id < 0 || job_id < 0){
        res.status(404).send('Invalid company id or job id');
    }
    Job.remove({jobId:job_id,comapnyId:comp_id},function(err) {
        if (err) {console.log(err);}
        else {
            var companyJobModel = companyJob.CompanyJob.build();
            companyJobModel.removeByJobId(job_id,function(jobs) {
                if (jobs) {
                    console.log(jobs);
                    //res.send("Deleted Successfully");
                    res.redirect('back');

                } else {
                    res.redirect('back');
                }
            }, function(error) {
                res.send(error);
            });
        }
    });
});


router.get('/:comp_id/search_candidate',function(req,res){
    console.log('reached search user '+req.query);
    var queryParam = req.query;
    var query=req.query.query;

    if (query!==null) {
        /* MemcacheClient.get(name, function(err, foundUser) {
         if (!err) {
         // Key found, display value
         res.render('searchUser', {
         foundUser: foundUser
         });
         }
         else {*/
        console.log("query: " + query);
        User.find({firstName: {$regex: new RegExp('^' + query, 'i')}}, function (err, foundUser) {
            console.log(foundUser);
            if (err) {
                console.log(err);
                res.redirect('index', {
                    message: null,
                    err: 'Cannot find user'
                });
            }
            else {
                res.render('recommendCandidate', {
                    foundUser: foundUser,
                    comp_id: req.params.comp_id
                });
            }
        });
    }
})

router.get('/:comp_id/recommendCandidate', function (req, res) {
    var comp_id = req.params.comp_id;
    res.render('recommendCandidate',{
        foundUser: null
    });
    //Job.find({companyId:comp_id},function(err,jobList){
    //    if (err ){ console.log("Error" + err);}
    //    else {
    //        console.log('Found company: ' + jobList );
    //        res.render('viewPostedJobs',{jobList:foundJob,companyId:comp_id} );
    //    }
    //});
});

router.post('/:comp_id/recommendCandidate', function (req, res) {
    var comp_id = req.params.comp_id;
    var job_id = req.body.jobId;
    console.log("Recommend candidate for job: " + job_id);
    if (comp_id < 0 || job_id < 0){
        res.status(404).send('Invalid company id or job id');
    }


    // query goes here
    //Job.remove({jobId:job_id,comapnyId:comp_id},function(err) {
    //    if (err) {console.log(err);}
    //    else {
    //        var companyJobModel = companyJob.CompanyJob.build();
    //        companyJobModel.removeByJobId(job_id,function(jobs) {
    //            if (jobs) {
    //                console.log(jobs);
    //                //res.send("Deleted Successfully");
    //                res.redirect('back');
    //
    //            } else {
    //                res.redirect('back');
    //            }
    //        }, function(error) {
    //            res.send(error);
    //        });
    //    }
    //});
});

module.exports = router;
