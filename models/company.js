var mongoose = require('mongoose');

var companySchema = new mongoose.Schema({
    companyId : String,
    name : String,
    //address: String,
    //url: String,
    imageUrl : String,
    //parentCompanyId: String,
    subLine: String,
    status: [
        { statusId: String, content: String, timestamp: String}],
    followers:[String]
    //jobs: [{
    //    jobId: String,
    //    title: String,
    //    createAt: {type: Date, expires: '30d', default: Date.now},
    //    description: String}],
});

module.exports = mongoose.model('Company', companySchema);