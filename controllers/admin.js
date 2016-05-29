var User  = require('../proxy').User;
var Blog  = require('../proxy').Blog;

var markdown = require('markdown').markdown;//一个纯文本编辑器
var validator = require('validator');//验证器
var eventproxy = require('eventproxy');//控制并发
var crypto = require('crypto');
var session = require('express-session');



//Client index
exports.showClientIndex = function(req, res) {
  res.render('client/index', {
    title: '主页'
  });
}
exports.showClientBlog = function(req, res) {
  res.render('client/blog', {
    title: 'blig'
  });
}
exports.showAdminSignin = function(req, res) {
  res.render('admin/signin', {
    title: '登陆'
  });
}

function checkLogin(req, res) {
  if (!req.session.userName) { 
    res.redirect('/adminSignin');
  }
}

//admin show index
exports.showAdminIndex = function(req, res, next) {
  checkLogin(req, res);
  res.render('admin/index', {
    title: '主页'
  });
}
//show addblog
exports.showAdminAddblog = function(req, res, next) {
  checkLogin(req, res);
  res.render('admin/addblog', {
    title: '主页',
    msg: '等待发布'
  });
}
//action of addblog
exports.adminAddblogAction = function (req, res, next) {
  //checkLogin(req, res);
  var title = req.body.title;
  var summary = req.body.summary;
  var desc = req.body.desc;
  //console.log(title);
  Blog.newAndSave(title, desc ,summary, function(err) {
    if(err) {
      return next(err);
    }
    res.render('admin/addblog', {
      title: '主页',
      msg: '发布成功！'
    });
  })
}
//signup
exports.showAdminSignup = function(req, res) {
	res.render('admin/signup', {
		title: '用户注册',
		err: '欢迎！'
	});
}
exports.adminSignupAction = function (req, res, next) {
  var userName = validator.trim(req.body.userName).toLowerCase();
  var password = validator.trim(req.body.password);
  var rePass    = validator.trim(req.body.rePass);

  var ep = new eventproxy();
  ep.fail(next);

  //on绑定prop_err事件,emit触发
  ep.on('prop_err', function (msg) {
    res.status(422);
    //req.flash('err', msg);flash不懂
    res.render('admin/signup', {title:'用户注册', err: msg});
  });

  if (userName.length < 5) {
    ep.emit('prop_err', '用户名至少需要5个字符。');
    return;
  }
  if (password.length < 6) {
    ep.emit('prop_err', '密码至少需要6个字符。');
    return;
  }
  
  if (password !== rePass) {
    return ep.emit('prop_err', '两次密码输入不一致。');
  }

  User.getUserByUserName(userName, function (err, user) {
    if (err) {
      return next(err);
    }
    if (user) {
      ep.emit('prop_err', '用户名已被使用。');
      return;
    }
    //生成密码的 md5 值进行加密
    var md5 = crypto.createHash('md5');
    password = md5.update(req.body.password).digest('hex');
    User.newAndSave(userName, password ,function(err) {
      if(err) {
        return next(err);
      }
      res.send("注册成功");
    })

  });
};

//signin
exports.showAdminSignin = function (req, res) {
  res.render('admin/signin', {
  	title: '用户登陆',
    err: '欢迎！'
  });
};

exports.adminSigninAction = function (req, res, next) {
  var userName = validator.trim(req.body.userName).toLowerCase();
  var password = validator.trim(req.body.password);
  var ep = new eventproxy();

  ep.fail(next);

  if (!userName || !password) {
    res.status(422);
    return res.render('admin/signin', { title: '用户登陆', err: '信息不完整。' });
  }

  ep.on('login_error', function (login_error) {   //绑定一个login_error事件
    res.status(403);
    res.render('admin/signin', { title: '用户登陆', err: '用户名或密码错误' });
  });
  var getUser = User.getUserByUserNameAndPassword;
  var md5 = crypto.createHash('md5');
  password = md5.update(req.body.password).digest('hex');
 
  getUser(userName, password,function(err, user) {
    if(user) {   
      // store session 
      req.session.userName = userName;
      res.render('admin/signin', {
        title: '用户登陆',
        err: req.session.userName
      });
    }
    else {
      res.render('admin/signin', {
        title: '用户登陆',
        err: '账号或密码错误'
      });
    }
  });
};

//后台安全退出
exports.adminSigninOut = function (req, res, next) {
  req.session.destroy();
  //res.clearCookie(config.auth_cookie_name, { path: '/' });
  res.redirect('/adminSignin');
};



