var mongoose = require('mongoose');

var userRecommendSchema = new mongoose.Schema({
    userId : Number,
    recommendId: Number
});

module.exports = mongoose.model('UserRecommend', userRecommendSchema);