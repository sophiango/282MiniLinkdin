var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    userId : String,
    fistName: String,
    lastName: String,
    middleName: String,
    skills: [],
    status: [],
    education:[{
        institution: String,
        degree: String,
        fromYear: String,
        toYear: String
    }],
    experience:[{
        position: String,
        company: String,
        fromYear: String,
        toYear: String,
        description: String}],
    following: [String]
});

var User = mongoose.model('User', userSchema);