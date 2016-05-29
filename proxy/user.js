var models = require('../models');

var User = models.User;

/**
 *添加新用户
 *
 */
exports.newAndSave = function (userName, password, callback) {
  var user         = new User();
  user.userName    = userName;
  user.password    = password;
  
  user.save(callback);
};
//判断用户是否存在
exports.getUserByUserName = function (userName, callback) {
  User.findOne({'userName': userName}, callback);
};
//判断用户密码是否一致
exports.getUserByUserNameAndPassword = function (userName, password, callback) {
  User.findOne({'userName': userName, 'password': password}, callback);
};
