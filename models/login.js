// login.js provides model for stroing the data into login table og mysql. this holds the data
//in mysql, also used when user/company signs up.
var DataTypes = require("sequelize");
var sequelize = require('../database/mysqlSeqlite');
var validator = require('validator');

var login = sequelize.define('Login', {
	id  : {
		type: DataTypes.INTEGER, autoIncrement: true, primarykey:true},
		
	userType : {
			type : DataTypes.STRING},
			
	email  : {
				type : DataTypes.STRING
				},
				
	lastLoggedIn  : {
		 type: DataTypes.DATE },
					
	password  : {
						type : DataTypes.STRING
						}},
						{freezeTableName : true,
							instanceMethods : {
								retrieveAll : function(onSuccess, onError) {
									login.findAll({}, {
										raw : true
									}).success(onSuccess).error(onError);
								},
								add : function(onSuccess, onError) {
									
									this.save().success(onSuccess).error(onError);
									
//									var id=this.id;
//									var email=this.email;
//									var userType=this.userType;
//									var lastLoggedIn=this.lastLoggedIn;
//									var password = this.password;
//									login.build({ id: id, password: password,email:email,userType:userType, lastLoggedIn:lastLoggedIn})
//									.save().success(onSuccess).error(onError);
									
								},
								removeById : function(userId, connectionId, onSuccess, onError) {
									login.destroy({
										where : {
											userId : userId,
											connectionId : connectionId
										}
									}).success(onSuccess).error(onError);
								},
								retrieveByUserId : function(id, onSuccess, onError) {
									login.findAll({
										where : {
											id : id
										}
									}, {
										raw : true
									}).success(onSuccess).error(onError);
								},
								
								retrieveALL : function(onSuccess, onError) {
									login.findAll({
										
									}, {
										raw : true
									}).success(onSuccess).error(onError);
								},
								retrieveByEmail : function(email, onSuccess, onError) {
									login.findAll({
										where : {
											email : email
										}
									}, {
										raw : true
									}).success(onSuccess).error(onError);
								},
								checKforLogin : function(email,userType,password, onSuccess, onError) {
									login.findAll({
										where : {
											email : email,
											userType : userType,
											password : password
										}
									}, {
										raw : true
									}).success(onSuccess).error(onError);
								},
								retrieveCoutByUserId : function(userId, onSuccess, onError) {
									login.count({
										where : {
											userId : userId
										}
									}, {
										raw : true
									}).success(onSuccess).error(onError);
								}

							}

});
//FollowUser.removeAttribute('id');
module.exports.login = login;