const { model, Schema } = require('mongoose');
 
let Xps = new Schema({
	Guild: String,
	Channel: String,
	points: Number,
})
 
module.exports = model('xps', Xps);