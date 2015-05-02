/**
 * New node file
 */
var sequelize = require('../database/mysqlSeqlite');

/*
 * var jobFollowing = function() { return {"userId":"",
 * "companyId":"","jobId":""}; };
 */

// var jobFollowing = {"userId":"", "companyId":"","jobId":""};
/*
 * Object.defineProperty(jobFollowing.prototype, "userId", { get: function() {
 * return this._userId ? this._userId : ""; } });
 * 
 * Object.defineProperty(jobFollowing.prototype, "companyId", { get: function() {
 * return this._companyId ? this._companyId : ""; } });
 * 
 * Object.defineProperty(jobFollowing.prototype, "jobId", { get: function() {
 * return this._jobId ? this._jobId : ""; } });
 */

var DataTypes = require("sequelize");

// var JobFollowing=module.exports={};
var JobApplication = sequelize.define('JobApplication', {
	userId : DataTypes.STRING,
	jobId : DataTypes.STRING,
	companyId : DataTypes.STRING
}, {
	freezeTableName : true,
	instanceMethods : {
		retrieveAll : function(onSuccess, onError) {
			JobApplication.findAll({}, {
				raw : true
			}).success(onSuccess).error(onError);
		},
		add : function(onSuccess, onError) {
			this.save().success(onSuccess).error(onError);
		},
		removeById : function(companyId, jobId, onSuccess, onError) {
			JobApplication.destroy({
				where : {
					companyId : companyId,
					jobId : jobId
				}
			}).success(onSuccess).error(onError);
		},
		retrieveByUserId : function(userId, onSuccess, onError) {
			JobApplication.findAll({
				where : {
					userId : userId
				}
			}, {
				raw : true
			}).success(onSuccess).error(onError);
		},
		retrieveByCompJobId : function(companyId, jobId, onSuccess, onError) {
			JobApplication.findAll({
				where : {
					companyId : companyId,
					jobId : jobId
				}
			}, {
				raw : true
			}).success(onSuccess).error(onError);
		}
	}
});
JobApplication.removeAttribute('id');
module.exports.JobApplication = JobApplication;
