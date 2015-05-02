var mongoose = require('mongoose');

var educationSchema = new mongoose.Schema({
	id:Number,
    institution: String,
    degree: String,
    fromYear: String,
    toYear: String
},{ _id : false });

var experienceSchema = new mongoose.Schema({
	id:Number,
    position: String,
    company: String,
    from: String,
    to: String,
    description:String
},{ _id : false });

var statusSchema = new mongoose.Schema({
    content: String,
    createAt: {type: Date, default: Date.now}
})

var userSchema = new mongoose.Schema({
    userId : {type : String , required : true, unique: true, dropDups: true},
    firstName: {type : String , required : true},
    lastName: {type : String , required : true},
    imageUrl : String,
    headline : String,
    skill1 : String,
    skill2 : String,
    skill3 : String,
    status: [statusSchema],
    education:[educationSchema],
    experience:[experienceSchema],
    companyId: String,
    headlineId: Number,
    skillOneId : Number,
    skillTwoId : Number,
    skillThreeId : Number
});

module.exports = mongoose.model('User', userSchema);