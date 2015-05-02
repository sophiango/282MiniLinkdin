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
	connection.query('select * from Location where value like ?',["%" + term+ "%"],function(err, result, fields) {
		  if (result)
		  {
			  console.log('result '+result[0].id+" "+result[0].value);
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