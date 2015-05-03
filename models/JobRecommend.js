var mongoose = require ('mongoose');

var jobRecommendSchema = new mongoose.Schema({
    userId: Number,
    jobId: Number,
    rating: Number
});

module.exports = mongoose.model('JobRecommend',jobRecommendSchema);