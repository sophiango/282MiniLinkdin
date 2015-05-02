/**
 * New node file
 */

var DataTypes = require("sequelize");
var sequelize = require('../database/mysqlSeqlite');

var CompanyJob = sequelize.define('CompanyJob', {
	jobId : DataTypes.STRING,
	companyId : DataTypes.STRING
}, {
	freezeTableName : true,
	instanceMethods : {
		
		add : function(onSuccess, onError) {
			this.save().success(onSuccess).error(onError);
		},
		removeByJobId : function(jobId, onSuccess, onError) {
			CompanyJob.destroy({
				where : {
					jobId : jobId
				}
			}).success(onSuccess).error(onError);
		},
		retrieveBycompanyId : function(companyId, onSuccess, onError) {
			CompanyJob.findAll({
				where : {
					companyId : companyId
				}
			}, {
				raw : true
			}).success(onSuccess).error(onError);
		}
		
	}
});
CompanyJob.removeAttribute('id');
module.exports.CompanyJob = CompanyJob;