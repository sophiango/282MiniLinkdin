/**
 * New node file
 */
var express = require('express');
var router = express.Router();
var path = require('path');
var mysqlConnection = require('./mySqlConnection');


router.post('/location', function(req, res) {
	console.log('reached route');

	var term = req.body.term;
	 console.log('term '+term);


	mysqlConnection.connection.getConnection(function(err, connection){
	console.log('Got Connected');
	connection.query('select * from Location where name like ?',["%" + term+ "%"],function(err, result, fields) {
		  if (result)
		  {
			  console.log('result '+result[0].id+" "+result[0].name);
			  connection.release();
			  return   res.json({"result":result});
		  }
		  else {
			  console.log('Error '+err);
			  connection.release();
		  return  res.json();
			}
	});

});
});

router.post('/skill', function(req, res) {
    console.log('suggest skills input');
    var skill = req.body.skill;
    console.log('skill '+skill);


    mysqlConnection.connection.getConnection(function(err, connection){
        console.log('Got Connected');
        connection.query('select * from Skill where name like ?',["%" + skill+ "%"],function(err, result, fields) {
            if (result)
            {
                console.log('result '+result[0].name);
                connection.release();
                return   res.json({"result":result});
            }
            else {
                console.log('Error '+err);
                connection.release();
                return  res.json();
            }
        });

    });
});

router.post('/company', function(req, res) {
    console.log('reached route');

    var term = req.body.term;
    console.log('term '+term);


    mysqlConnection.connection.getConnection(function(err, connection){
        console.log('Got Connected');
        connection.query('select * from Company where name like ?',["%" + term+ "%"],function(err, result, fields) {
            if (result)
            {
                console.log('result '+result[0].id+" "+result[0].name);
                connection.release();
                return   res.json({"result":result});
            }
            else {
                console.log('Error '+err);
                connection.release();
                return  res.json();
            }
        });

    });
});


router.post('/position', function(req, res) {
    console.log('reached route');

    var term = req.body.term;
    console.log('term '+term);


    mysqlConnection.connection.getConnection(function(err, connection){
        console.log('Got Connected');
        connection.query('select * from Position where name like ?',["%" + term+ "%"],function(err, result, fields) {
            if (result)
            {
                console.log('result '+result[0].id+" "+result[0].name);
                connection.release();
                return   res.json({"result":result});
            }
            else {
                console.log('Error '+err);
                connection.release();
                return  res.json();
            }
        });

    });
});

module.exports = router;