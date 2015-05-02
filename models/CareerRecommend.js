var mongoose = require ('mongoose');

var careerRecommendSchema = new mongoose.Schema({
    position1:Number,
    position2:String,
    position3:String,
    position4:String
});

module.exports = mongoose.model('CareerRecommend',careerRecommendSchema);