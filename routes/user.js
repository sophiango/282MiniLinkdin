var express = require('express');
var router = express.Router();
var chance = require('chance').Chance();
var User = require('../models/user');
var Company = require('../models/company');

router.post('/',function(req,res){
    var user_id_str = chance.natural({min: 1, max: 100000}).toString();
    //company_id = (company_id + 1);
    //var companyId_str = company_id.toString();
    var newUser = new User ({
        userId : user_id_str,
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        headline : req.body.headline,
        imageUrl : req.body.imageUrl,
        education : [
            {institution: req.body.institution,
            degree: req.body.degree,
            fromYear: req.body.fromYear,
            toYear: req.body.toYear}],
        experience : [{
            position: req.body.position,
            company: req.body.company,
            from: req.body.from,
            to: req.body.to,
            description: req.body.description
        }],
        companyId :null
    });
    //newUser.education.push({
    //    institution: req.body.institution,
    //    degree: req.body.degree,
    //    fromYear: req.body.fromYear,
    //    toYear: req.body.toYear
    //})
    //
    //newUser.experience.push({
    //    position: req.body.position,
    //    company: req.body.company,
    //    from: req.body.from,
    //    to: req.body.to,
    //    description: req.body.description
    //})

    newUser.save(function (err, newUser) {
        if (err) console.log(err);
        else {
            console.log('Saved : ', newUser );
            res.status(201).send('Successfully created a user');
        }
    });
});

router.get('/:user_id', function (req, res) {
    var user_id = req.params.user_id;
    if (user_id < 0) {
        res.status(404).send('Invalid company id');
    }
    User.findOne({userId:user_id},function(err,foundUser){
        if (err) console.log(err);
        else {
            Company.findOne({name:foundUser.experience[0].company},function(err,foundCompany){
                if (err) console.log(err);
                else {
                    console.log('Found user: ' + foundUser.firstName);
                    var fullName = foundUser.firstName + " " + foundUser.lastName;
                    res.render('user', {
                        title: 'Mini-Linkedin',
                        name: fullName,
                        headline: foundUser.headline,
                        image_url: foundUser.imageUrl,
                        position_time_range: foundUser.experience[0].from + " - " + foundUser.experience[0].to,
                        skill_1: foundUser.skills[0],
                        skill_2: foundUser.skills[1],
                        skill_3: foundUser.skills[2],
                        skill_4: foundUser.skills[3],
                        skill_5: foundUser.skills[4],
                        institution: foundUser.education[0].institution,
                        degree: foundUser.education[0].degree,
                        school_time_range: foundUser.education[0].fromYear + " - " + foundUser.education[0].toYear,
                        position: foundUser.experience[0].position,
                        company_name: foundUser.experience[0].company,
                        company_logo: foundCompany.imageUrl,
                        job_description: foundUser.experience[0].description
                    });}
            });}});
});

router.put('/:user_id', function (req, res) {
    var user_id = req.params.user_id;
    newHeadline = req.body.headline;
    User.update({userId:user_id},{$set:{headline:newHeadline}},
        function(err){
            if (err) console.log(err);
            res.status(200).send('Successfully update a job');
        })
});

router.delete('/:user_id', function (req, res) {
    var user_id = req.params.user_id;
    if (user_id < 0){
        res.status(404).send('Invalid company id or job id');
    }
    User.remove({userId:user_id},function(err) {
        if (err) console.log(err);
        else res.status(204).send('Successfully delete user');
    })
});

module.exports = router;
