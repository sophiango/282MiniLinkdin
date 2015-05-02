var Sequelize = require('sequelize');

// db config
var env = "dev";
var config = require('../database.json')[env];
var password = config.password ? config.password : null;

// initialize database connection
//var sequelize=module.exports={};

module.exports=new Sequelize(
	
	config.database,
	config.user,
	config.password,
	
	{
		host: config.host,
		dialect: config.driver,
		logging: console.log,
		define: {
			timestamps: false
		}
	}
);

