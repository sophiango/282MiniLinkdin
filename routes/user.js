var express = require('express');
var router = express.Router();
var chance = require('chance').Chance();
var User = require('../models/user');
var Company = require('../models/company');

router.post('/',function(req,res){
    var user_id_str = chance.natural({min: 1, max: 100000}).toString();
    var newUser = new User ({
        userId : user_id_str,
        firstName : req.body.inputFirstName,
        lastName : req.body.inputLastName});
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
                    res.render('user',{
                        user_id: user_id,
                        name: foundUser.firstName + " " + foundUser.lastName,
                        User: foundUser,
                        Company: foundCompany});
                    }
            });}});
});

router.post('/:user_id', function (req, res) {
    var user_id = req.params.user_id;
    console.log("Method put is called");
    User.findOne({userId:user_id},function(err,foundUser){
        if (err) console.log(err);
        else {
            Company.findOne({name:foundUser.experience[0].company},function(err,foundCompany){
                if (err) console.log(err);
                else {
                    res.render('edit_user',{
                        user_id: user_id,
                        name: foundUser.firstName + " " + foundUser.lastName,
                        User: foundUser,
                        Company: foundCompany});
                }
            });}});
    //newHeadline = req.body.headline;
    //User.update({userId:user_id},{$set:{headline:newHeadline}},
    //    function(err){
    //        if (err) console.log(err);
    //        //res.status(200).send('Successfully update a job');
    //    })
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
