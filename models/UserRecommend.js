var mongoose = require('mongoose');

var userRecommendSchema = new mongoose.Schema({
    userId : Number,
    candidateId: Number,
    rating: Number
});

module.exports = mongoose.model('UserRecommend', userRecommendSchema);