var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/blog');
var Schema = mongoose.Schema;

var userSchema = new Schema ({
  userName: {type: String},
  password: {type: String}
});

mongoose.model('users', userSchema);