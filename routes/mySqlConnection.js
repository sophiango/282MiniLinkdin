var mysql      = require('mysql');
var env = "dev";
var config = require('../database.json')[env];

module.exports = { connection : mysql.createPool({
  host     :  config.host,
  user     :  config.user,
  password : config.password,
  database : config.database
})};
//module.exports=connection;