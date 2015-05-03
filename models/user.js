var mongoose = require('mongoose');


var userSchema = new mongoose.Schema({
    userId : {type : Number , required : true, unique: true, dropDups: true},
    firstName: {type : String , required : true},
    lastName: {type : String , required : true},
    imageUrl : String,
    skill1 : String,
    skill2 : String,
    skill3 : String,
    status: [statusSchema],
    education:String,
    position1 : String,
    position2 : String,
    position3 : String,
    position4 : String,
    headlineId: Number,
    pid1:Number,
    pid2:Number,
    pid3:Number,
    pid4:Number,
    positionCount: Number,
    company1:String,
    company2:String,
    company3:String,
    company4:String,
    cId1:Number,
    cId2:Number,
    cId3:Number,
    cId4:Number,
    headline : String,
    locationId:Number,
    location:String,
    createdAt:String,
    lastUpdated:String

});

module.exports = mongoose.model('User', userSchema);