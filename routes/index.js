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
        err: null,
        next_page:null
    });
});

module.exports = router;
