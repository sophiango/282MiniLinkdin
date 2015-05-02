/**
 * New node file
 */

var DataTypes = require("sequelize");
var sequelize = require('../database/mysqlSeqlite');
var validator = require('validator');

var FollowUser = sequelize.define('FollowUser', {
	userId : {
		type : DataTypes.STRING,
		allowNull: false,
		validate : {
			min : 1,
			notEmpty: true,
		}
	},
	connectionId : {
			type : DataTypes.STRING,
			allowNull: false,
			validate : {
				min : 1,
				notEmpty: true,
			}
		}
	}
, {
	freezeTableName : true,
	instanceMethods : {
		retrieveAll : function(onSuccess, onError) {
			FollowUser.findAll({}, {
				raw : true
			}).success(onSuccess).error(onError);
		},
		add : function(onSuccess, onError) {
			this.save().success(onSuccess).error(onError);
		},
		removeById : function(userId, connectionId, onSuccess, onError) {
			FollowUser.destroy({
				where : {
					userId : userId,
					connectionId : connectionId
				}
			}).success(onSuccess).error(onError);
		},
		retrieveByUserId : function(userId, onSuccess, onError) {
			FollowUser.findAll({
				where : {
					userId : userId
				}
			}, {
				raw : true
			}).success(onSuccess).error(onError);
		},
		retrieveByConnId : function(connectionId, onSuccess, onError) {
			FollowUser.findAll({
				where : {
					connectionId : connectionId
				}
			}, {
				raw : true
			}).success(onSuccess).error(onError);
		},
		retrieveCoutByUserId : function(userId, onSuccess, onError) {
			FollowUser.count({
				where : {
					userId : userId
				}
			}, {
				raw : true
			}).success(onSuccess).error(onError);
		}

	}
});
FollowUser.removeAttribute('id');
module.exports.FollowUser = FollowUser;