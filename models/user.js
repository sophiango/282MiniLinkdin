var mongoose = require('mongoose');

var educationSchema = new mongoose.Schema({
    institution: String,
    degree: String,
    fromYear: String,
    toYear: String
},{ _id : false });

var experienceSchema = new mongoose.Schema({
    position: String,
    company: String,
    from: String,
    to: String,
    description: String
},{ _id : false });

var userSchema = new mongoose.Schema({
    userId : String,
    fistName: String,
    lastName: String,
    headline : String,
    skills: [],
    status: [],
    education:[educationSchema],
    experience:[experienceSchema],
    following: [String] // companyId
});

module.exports = mongoose.model('User', userSchema);