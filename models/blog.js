var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;

var BlogSchema = new Schema({
	title: { type: String},
	summary: { type: String},
	desc: { type: String},
	
	author_id: { type: String },
	create_at: { type: Date, default: Date.now }
});

mongoose.model('blogs', BlogSchema);