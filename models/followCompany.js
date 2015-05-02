/**
 * New node file
 */

var DataTypes = require("sequelize");
var sequelize = require('../database/mysqlSeqlite');

var FollowCompany = sequelize.define('FollowCompany', {
	userId : DataTypes.STRING,
	companyId : DataTypes.STRING
}, {
	freezeTableName : true,
	instanceMethods : {
		retrieveAll : function(onSuccess, onError) {
			FollowCompany.findAll({}, {
				raw : true
			}).success(onSuccess).error(onError);
		},
		add : function(onSuccess, onError) {
			this.save().success(onSuccess).error(onError);
		},
		removeByUserId : function(userId, onSuccess, onError) {
			FollowCompany.destroy({
				where : {
					userId : userId
				}
			}).success(onSuccess).error(onError);
		},
		retrieveByUserId : function(userId, onSuccess, onError) {
			FollowCompany.findAll({
				where : {
					userId : userId
				}
			}, {
				raw : true
			}).success(onSuccess).error(onError);
		},
		retrieveByCompId : function(companyId,onSuccess, onError) {
			FollowCompany.findAll({
				where : {
					companyId : companyId
					}
			}, {
				raw : true
			}).success(onSuccess).error(onError);
		},
		retrieveCoutByCompId : function(companyId,onSuccess, onError) {
			FollowCompany.count({
				where : {
					companyId : companyId
					}
			}, {
				raw : true
			}).success(onSuccess).error(onError);
		}
		
	}
});
FollowCompany.removeAttribute('id');
module.exports.FollowCompany = FollowCompany;