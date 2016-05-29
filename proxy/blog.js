var models = require('../models');

var Blog = models.Blog;

/**
 *添加blog
 *
 */
exports.newAndSave = function (title, desc, summary, callback) {
  var blog         = new Blog();
  blog.title       = title;
  blog.summary     = summary;
  blog.desc        = desc;
  //console.log(blog.title);
  blog.save(callback);
};

//获取定量的blogs
exports.limitNews = function(page, perPage, callback) {
//获取总数
  Blog.count({}, function (err, count) {
  //获取列表
    Blog.find({}).sort({'_id':-1}).skip((page-1)*perPage).limit(perPage).exec(function(err,doc){
        
        var d= [];
        d.data = doc;
        d.count = count;
        callback(err,d);

    })
	});
}

exports.findByID = function(id, callback) {
	Blog.findOne({_id:id}, callback);
}

