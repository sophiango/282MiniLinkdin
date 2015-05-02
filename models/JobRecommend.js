var mongoose = require ('mongoose');

var jobRecommendSchema = new mongoose.Schema({
    position1:Number,
    position2:String,
    position3:String,
    position4:String
});

module.exports = mongoose.model('JobRecommend',jobRecommendSchema);