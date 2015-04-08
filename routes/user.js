var express = require('express');
var router = express.Router();
var chance = require('chance').Chance();
var User = require('../models/user');
var Company = require('../models/company');
var Job = require('../models/job');

router.get('/:user_id/dashboard',function(req,res){
    User.findOne({userId:req.params.user_id},function(err,foundUser){
        if (err) {
            console.log(err);
            res.render('index',{
                message:null,
                err: 'Cannot find user'
            })
        }
        else {
            res.render('dashboard',{
                name: User.firstName,
                connection_count: '100',
                User: foundUser
            })
        }
    });
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

router.get('/:user_id', function (req, res) {
    var user_id = req.params.user_id;
    if (user_id < 0) {
        res.status(404).send('Invalid company id');
    }
    User.findOne({userId:user_id},function(err,foundUser){
        if (err) {
            console.log(err);
            res.render('index',{
                message:null,
                err: 'Cannot find user'
            })
        }
        else {
            console.log(foundUser);
            res.render('user',{
                name: 'Sophia',
                connection_count: '100',
                User: foundUser});
        }
    });
});

router.get('/:user_id/edit_profile',function (req, res) {
    res.render('edit_profile',{
        user_id: req.params.user_id,
        name: null
    })
});

router.post('/:user_id/edit_profile', function (req, res) {
    var user_id = req.params.user_id;
    User.update({userId:user_id},{$set: {
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            headline : req.body.headline
        }},
        function(err,foundUser){
            if (err) {
                console.log(err);
                res.render('index',{
                    message:null,
                    err: 'Cannot edit user'
                })
            }
            else{
                User.findOne({userId:req.params.user_id}, function (err, foundUser) {
                    if (err) {
                        console.log(err);
                        if (err) {
                            res.render('index',{
                                message:null,
                                err: 'Cannot find user'
                            })
                        }
                    }
                    else {
                        res.render('user', {
                            name: foundUser.firstName + " " + foundUser.lastName,
                            connection_count: '100',
                            User: foundUser
                        });
                    }
                });
            }
        });
});

router.post('/:user_id/exp',function (req, res) {
    User.findOne({userId:req.params.user_id},function(err,foundUser) {
        if (err) {
            console.log(err);
            res.render('index',{
                message:null,
                err: 'Cannot find user'
            })
        }
        else {
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
                        name: null,
                        message:null,
                        err: "Cannot add new experience"
                    })
                }
                else{
                    res.render('add_new_exp',{
                        user_id: User.userId,
                        name: null,
                        message:"Successfully added an experience. You can add more experience or go back to your profile",
                        err: null
                    })
                }
            });
        }
    });
});

router.get('/:user_id/exp',function (req, res) {
    res.render('add_new_exp',{
        user_id: req.params.user_id,
        name: null,
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
            if(foundUser.experience.length>0) {
                res.render('edit_exp', {
                    user_id: req.params.user_id,
                    name: null,
                    User: foundUser
                })
            }
            else{
                res.render('add_new_exp', {
                    user_id: req.params.user_id,
                    name: null,
                    message: null,
                    err: null
                })
            }
        }
    });
});

router.post('/:user_id/edit_exp', function (req, res) {
    var user_id = req.params.user_id;
    return User.findOne({userId: req.params.user_id}, function (err, foundUser) {
        foundUser.position= req.body.inputPosition,
            foundUser.company= req.body.inputCompany,
            foundUser.from= req.body.inputFrom,
            foundUser.to= req.body.inputTo,
            foundUser.description= req.body.inputDesc
        return foundUser.save(function (err) {
            if (!err) {
                res.render('user', {
                    name: foundUser.firstName + " " + foundUser.lastName,
                    connection_count: '100',
                    User: foundUser
                });
            } else {
                console.log(err);
            }
        });
    });
});

router.post('/:user_id/edu',function (req, res) {
    User.findOne({userId:req.params.user_id},function(err,foundUser) {
        if (err) {
            console.log(err);
            res.render('index',{
                message:null,
                err: 'Cannot find user'
            })
        }
        else {
            foundUser.education.push({
                institution: req.body.inputSchool,
                degree: req.body.inputDegree,
                fromYear: req.body.inputFrom,
                toYear: req.body.inputTo
            });
            foundUser.save(function (err) {
                if (err) {
                    res.render('add_new_edu',{
                        user_id: User.userId,
                        name: null,
                        message:null,
                        err: "Cannot add new institution"
                    })
                }
                else{
                    res.render('add_new_edu',{
                        user_id: User.userId,
                        name: null,
                        message:"Successfully added an institution. You can add more institution or go back to your profile",
                        err: null
                    })
                }
            });
        }
    });
});

router.get('/:user_id/edu',function (req, res) {
    res.render('add_new_edu',{
        user_id: req.params.user_id,
        name: null,
        message:null,
        err:null
    })
});

router.get('/:user_id/edit_edu',function (req, res) {
    User.findOne({userId:req.params.user_id},function(err,foundUser){
        if (err) {
            console.log(err);
            res.render('index',{
                message:null,
                err: 'Cannot find user'
            })
        }
        else {
            if(foundUser.education.length>0) {
                res.render('edit_edu', {
                    user_id: req.params.user_id,
                    name: null,
                    User: foundUser
                })
            }
            else{
                res.render('add_new_edu', {
                    user_id: req.params.user_id,
                    name: null,
                    message: null,
                    err: null
                })
            }
        }
    });
});

router.post('/:user_id/edit_edu', function (req, res) {
    var user_id = req.params.user_id;
    return User.findOne({userId: req.params.user_id}, function (err, foundUser) {
            foundUser.institution= req.body.inputSchool,
            foundUser.degree= req.body.inputDegree,
            foundUser.fromYear= req.body.inputFrom,
            foundUser.toYear= req.body.inputTo
        return foundUser.save(function (err) {
            if (!err) {
                res.render('user', {
                    name: foundUser.firstName + " " + foundUser.lastName,
                    connection_count: '100',
                    User: foundUser
                });
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

router.get('/:user_id/company/:comp_id', function (req, res) {
    var comp_id = req.params.comp_id;
    if (comp_id < 0) {
        res.status(404).send('Invalid company id');
    }
    Company.findOne({companyId:comp_id},function(err,foundCompany){
        if (err) {
            console.log(err);
            res.render('index',{
                message:null,
                err: 'Cannot find user'
            })
        }
        else {
            res.render('company',{
                Company: foundCompany
            })
            //res.status(200).send('Successfully get a company ' + comp_id);
        }
    })
});

router.post('/:user_id/company/',function(req,res){
    var companyId_str = chance.natural({min: 1, max: 100000}).toString();
    //company_id = (company_id + 1);
    //var companyId_str = company_id.toString();
    var newCompany = new Company ({
        companyId : companyId_str,
        name : req.body.inputCompanyName,
        imageUrl : req.body.imageUrl,
        subLine : req.body.inputCompanyDesc
    })
    console.log(newCompany);
    //newCompany.save(function (err, data) {
    //    if (err) console.log(err);
    //    else {
    //        console.log('Saved : ', data );
    //        res.status(201).send('Successfully created a company');
    //    }
    //});
});

router.put('/:user_id/company/:comp_id', function (req, res) {
    var comp_id = req.params.comp_id;
    newName = req.body.name;
    newImageUrl = req.body.imageUrl;
    newSubLine = req.body.subLine;
    Company.update({companyId:comp_id},{$set:{name:newName,imageUrl:newImageUrl,subLine:newSubLine}},
        function(err,updatedJob){
            if (err) console.log(err);
            res.status(200).send('Successfully update a job');
        })
});

router.delete('/:user_id/company/:comp_id', function (req, res) {
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
            if (err) console.log(err);
            else delete_in_job = true;
            if (delete_in_company && delete_in_job){
                res.status(204).send('Successfully delete company');
            }
        })
    })
});

router.post('/:user_id/company/:comp_id/job', function (req, res) {
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
            });
            newJob.save(function (err) {
                if (err) console.log(err);
                else {
                    res.render();
                }
            });
        }
    });
    //new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
});

router.get('/:user_id/company/:comp_id/job/:job_id', function (req, res) {
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

router.put('/:user_id/company/:comp_id/job/:job_id', function (req, res) {
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

router.delete('/:user_id/company/:comp_id/job/:job_id', function (req, res) {
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

router.post('/:user_id/status',function(req,res){

});

module.exports = router;
