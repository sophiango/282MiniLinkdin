var express = require('express');
var router = express.Router();
var chance = require('chance').Chance();
var Company = require('../models/company');
var Job = require('../models/job');

/* GET users listing. */
router.get('/', function(req, res) {
    res.send('respond with a resource');
});

router.post('/',function(req,res){
    var companyId_str = chance.natural({min: 1, max: 100000}).toString();
    //company_id = (company_id + 1);
    //var companyId_str = company_id.toString();
    var newCompany = new Company ({
        companyId : companyId_str,
        name : req.body.name,
        imageUrl : req.body.imageUrl,
        subLine : req.body.subLine
        })
    newCompany.save(function (err, data) {
        if (err) console.log(err);
        else {
            console.log('Saved : ', data );
            res.status(201).send('Successfully created a company');
        }
    });
});

router.get('/:comp_id', function (req, res) {
    var comp_id = req.params.comp_id;
    if (comp_id < 0) {
        res.status(404).send('Invalid company id');
    }
    Company.findOne({companyId:comp_id},function(err,data){
        if (err) console.log(err);
        else {
            console.log('Found company: ' + data.name );
            res.status(200).send('Successfully get a company ' + comp_id);
        }
    })
});

router.put('/:comp_id', function (req, res) {
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

router.delete('/:comp_id', function (req, res) {
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

router.post('/:comp_id/job', function (req, res) {
    var comp_id = req.params.comp_id;
    if (comp_id < 0) {
        res.status(404).send('Invalid company id');
    }
    var jobId = chance.natural({min: 1, max: 10000}).toString();
    var position = req.body.position;
    var description = req.body.description;
    Company.findOne({companyId:comp_id},function(err,foundCompany){
        if (err) console.log(err);
        else {
            company_name = foundCompany.name;
            var newJob = new Job ({
                jobId : jobId,
                companyId : comp_id,
                position : position,
                company : company_name,
                description : description
                //createdAt : Date.now()
            })
            newJob.save(function (err, data) {
                if (err) console.log(err);
                else {
                    console.log('Saved : ' + data );
                    res.status(201).send('Successfully created a job');
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
