var mongoose = require('mongoose');

var jobSchema = new mongoose.Schema({
        jobId: {type : Number , required : true, unique: true, dropDups: true},
        companyId: {type : Number , required : true},
        position: {type : String , required : true},
        company: {type : String , required : true},
        location: {type : String , required : true},
        description: {type : String , required : true},
        expires: {type: Date, required: true}
});

module.exports = mongoose.model('Job', jobSchema);