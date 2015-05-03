var mongoose = require('mongoose');

var statusSchema = new mongoose.Schema({
    content: {type : String , required : true},
    createAt: {type: Date, default: Date.now}
})

//var jobSchema = new mongoose.Schema({
//    jobId: String,
//    position: String,
//    location: String,
//    description: String,
//    createAt: {type: Date, expires: '1d', default: Date.now}
//},{ _id : false })

var companySchema = new mongoose.Schema({
    companyId : {type : Number , required : true, unique: true, dropDups: true},
    name : {type : String , required : true, unique: true, dropDups: true},
    email: {type : String , required : true, unique: true, dropDups: true},
    addressLine1: {type : String },
    addressLine2: {type : String},
    addressLine3: {type : String},
    addressCountry: {type : String },
    addressState:{type : String},
    addressCity:{type : String},
    addressZipCode:{type : String},
    url: String,
    imageUrl : String,
    //parentCompanyId: String,
    description: String,
    status: [{textPost: {type : String },
    	     created_at: { type: Date }}]
    
    //jobs: [{
    //    jobId: String,
    //    title: String,
    //    createAt: {type: Date, expires: '30d', default: Date.now},
    //    description: String}],
});

module.exports = mongoose.model('Company', companySchema);