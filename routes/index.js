var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
      title: 'Mini-Linkedin',
      custom_header: 'A simplified version of Linkedin',
      intro_about_page: 'This website is a result of lab 3 CMPE 282 SJSU',
      sub_header_1:'Secured profile for users and companies',
      more_sub_header_1:'Authentication, restricted endpoint',
      sub_header_2:'Efficient job search',
      more_sub_header_2:'Search many jobs posted by companies',
      sub_header_3:'Featured recommend career path (upcoming)',
      more_sub_header_3:'Recommend career path base on your expierence'});
});

module.exports = router;
