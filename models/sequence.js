/**
 * New node file
 */
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;
 
var IdSchema = new Schema({
  prefix: { type: String, required: true, index: { unique: true } },
  count:  { type: Number, required: true }
});
 
module.exports =mongoose.model('Id', IdSchema);
 