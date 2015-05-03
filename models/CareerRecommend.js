var mongoose = require ('mongoose');

var careerRecommendSchema = new mongoose.Schema({
    pid1:Number,
    pid2:Number,
    pid3:Number,
    pid4:Number,
    position1:String,
    position2:String,
    position3:String,
    position4:String
});

module.exports = mongoose.model('CareerRecommend',careerRecommendSchema);