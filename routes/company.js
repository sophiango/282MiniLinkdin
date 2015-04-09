var express = require('express');
var router = express.Router();
var chance = require('chance').Chance();
var Company = require('../models/company');
var Job = require('../models/job');

/* GET users listing. */
router.get('/', function(req, res) {
    //res.render('index', { title: 'Express' })
});

router.get('/:comp_id/home', function (req, res) {
    Company.findOne({companyId:req.params.comp_id},function(err,foundComp){
        if (err || foundComp === null) {
            console.log(err);
            res.render('index',{
                message:null,
                err: 'Cannot find company'
            })
        }
        else {
            console.log(foundComp);
            res.render('company_home',{
                connection_count: '100',
                Company: foundComp
            })
        }
    });
})

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
                Company: foundCompany
            })
        }
    })
});

router.post('/',function(req,res){
    var companyId_str = chance.natural({min: 1, max: 100000}).toString();
    //company_id = (company_id + 1);
    //var companyId_str = company_id.toString();
    var newCompany = new Company ({
        companyId : companyId_str,
        email: req.body.inputEmail,
        name : req.body.inputCompName,
        //imageUrl : req.body.imageUrl,
        description : req.body.inputDesc
    })
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

router.get('/:comp_id/edit_profile',function (req, res) {
    console.log("call");
    res.render('edit_comp_profile',{
        companyId: req.params.comp_id
    })
});

router.post('/:comp_id/edit_profile', function (req, res) {
    var comp_id = req.params.comp_id;
    Company.update({companyId:comp_id},{$set: {
            name : req.body.inputName,
            description : req.body.inputDesc
        }},
        function(err,foundUser){
            if (err) {
                console.log(err);
                res.render('index',{
                    message:null,
                    err: 'Cannot edit company'
                })
            }
            else{
                Company.findOne({companyId:comp_id},function(err,foundCompany){
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(foundCompany);
                        res.render('company',{
                            count: '10k' , // hardcode count
                            Company: foundCompany
                        })
                    }
                })
            }
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
    var jobId = chance.natural({min: 1, max: 10000}).toString();
    var position = req.body.position;
    var description = req.body.description;
    var location = req.body.location;
    Company.findOne({companyId:comp_id},function(err,foundCompany){
        if (err) console.log(err);
        else {
            company_name = foundCompany.name;
            var newJob = new Job ({
                jobId : jobId,
                companyId : comp_id,
                company : company_name,
                position : position,
                location: location,
                description : description
                //createdAt : Date.now()
            })
            newJob.save(function (err) {
                if (err) console.log(err);
                else {
                    Company.update({companyId:comp_id},
                        {$push: {"jobs": {
                            jobId : jobId,
                            position : position,
                            description : description,
                            location: location
                        }}},
                        function(err) {
                            console.log(err);
                            res.status(201).send('Successfully created a job');
                        }
                    );
                }
            });
        }
    })
    //new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
});

router.get('/:comp_id/job/:job_id', function (req, res) {
    var comp_id = req.params.comp_id;
    var job_id = req.params.job_id;
    if (comp_id < 0 || job_id < 0) {
        res.status(404).send('Invalid company id');
    }
    Job.findOne({jobId:job_id},function(err,foundJob){
        if (err) console.log(err);
        else {
            console.log('Found company: ' + foundJob.position + "," + foundJob.company );
            res.status(200).send('Successfully get a job ' + job_id );
        }
    })
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

router.delete('/:comp_id/job/:job_id', function (req, res) {
    var comp_id = req.params.comp_id;
    var job_id = req.params.job_id;
    if (comp_id < 0 || job_id < 0){
        res.status(404).send('Invalid company id or job id');
    }
    Job.remove({jobId:job_id},function(err) {
        if (err) console.log(err);
        else res.status(204).send('Successfully deleted a job');
    })
});

module.exports = router;
