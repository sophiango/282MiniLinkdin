var mongoose = require ('mongoose');

var lookupJobSchema = new mongoose.Schema({
    LookupValue:Number,
    Position:String
});

module.exports = mongoose.model('LookupJob',lookupJobSchema);