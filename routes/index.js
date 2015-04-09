var express = require('express');
var router = express.Router();

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


router.get('/signupUser',function(req,res){
    res.render('user_signup_form',{
        message:null,
        err: null,
        next_page:null
    });
});

router.get('/signupComp',function(req,res){
    res.render('company_signup_form',{
        message:null,
        err: null,
        next_page:null
    });
});

module.exports = router;
