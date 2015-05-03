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
    userId : {type : Number , required : true, unique: true, dropDups: true},
    firstName: {type : String , required : true},
    lastName: {type : String , required : true},
    imageUrl : String,
    skill1 : String,
    skill2 : String,
    skill3 : String,
    status: [statusSchema],
    education:[educationSchema],
    headline : String,
    position1 : String,
    position2 : String,
    position3 : String,
    position4 : String,
    headlineId: Number,
    pid1:Number,
    pid2:Number,
    pid3:Number,
    pid4:Number,
    positionCount: Number

});

module.exports = mongoose.model('User', userSchema);