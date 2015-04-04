var express = require('express');
var router = express.Router();
var chance = require('chance').Chance();
var User = require('../models/user');

router.post('/',function(req,res){
    var user_id_str = chance.natural({min: 1, max: 100000}).toString();
    //company_id = (company_id + 1);
    //var companyId_str = company_id.toString();
    var newUser = new User ({
        userId : user_id_str,
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        headline : req.body.headline,
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
        }]
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
            console.log('Found company: ' + foundUser.firstName );
            res.status(200).send('Successfully get a company ' + comp_id);
        }
    })
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
