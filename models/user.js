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

var statusSchema = new mongoose.Schema({
    content: String,
    createAt: {type: Date, default: Date.now}
})

var userSchema = new mongoose.Schema({
    userId : String,
    firstName: String,
    lastName: String,
    imageUrl : String,
    headline : String,
    skills: [String],
    status: [statusSchema],
    education:[educationSchema],
    experience:[experienceSchema],
    following: [String], // companyId
    companyId: String
});

module.exports = mongoose.model('User', userSchema);