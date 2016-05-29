var mongoose = require('mongoose');
var config   = require('../config');



// models
require('./user');
require('./blog');

exports.User = mongoose.model('users');
exports.Blog = mongoose.model('blogs');

