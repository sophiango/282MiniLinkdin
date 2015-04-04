var mongoose = require('mongoose');

var jobSchema = new mongoose.Schema({
        jobId: String,
        companyId: String,
        position: String,
        company: String,
        description: String,
        createAt: {type: Date, expires: '1d', default: Date.now}

});

module.exports = mongoose.model('Job', jobSchema);