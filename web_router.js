var express = require('express');

var clientController = require('./controllers/client');
var adminController = require('./controllers/admin');

var router = express.Router();




router.get('/', clientController.showClientIndex);//show客户端主页
router.get('/blog', clientController.showClientBlog);//show客户端blog页


router.get('/adminSignin', adminController.showAdminSignin);//show后台登陆页
router.get('/adminSignup', adminController.showAdminSignup);//show后台注册页
router.post('/adminSignupAction', adminController.adminSignupAction);//Action后台注册
router.post('/adminSigninAction', adminController.adminSigninAction);//Action后台登陆
router.get('/adminSigninOut', adminController.adminSigninOut);//Action后台登陆
router.get('/admin', adminController.showAdminIndex);//show客户端主页
router.get('/addblog', adminController.showAdminAddblog);//show addblog页
router.post('/addblog', adminController.adminAddblogAction);//action addblog
router.get('/showBlogPage', clientController.showClientBlogPage);//show addblog页

module.exports = router;