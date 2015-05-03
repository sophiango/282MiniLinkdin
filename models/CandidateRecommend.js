var mongoose = require ('mongoose');

var candidateRecommendSchema = new mongoose.Schema({
    userId:Number,
    candidate1:Number,
    candidate2:Number,
    candidate3:Number
});

module.exports = mongoose.model('CandidateRecommend',candidateRecommendSchema);