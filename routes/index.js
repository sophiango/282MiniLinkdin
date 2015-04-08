var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/index', function(req, res) {
    res.render('index');
});

router.get('/index', function(req, res) {
    res.render('index');
});

router.get('/signup',function(req,res){
    res.render('user_signup_form',{
        message:null,
        return_error: null
    });
});

router.get('/addCompany',function(req,res){
    res.render('add_company');
});

router.get('/edit',function(req,res){
    res.render('edit_user',{name:"Sophia"});
});

module.exports = router;
