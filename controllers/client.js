var Blog  = require('../proxy').Blog;
var markdown = require('markdown').markdown;




exports.showClientIndex = function(req, res) {
	res.render('client/index');
}

exports.showClientBlog = function(req, res) {
	var page = (req.query.p)?req.query.p:1;
  var perPage = (req.query.pr)?req.query.pr:3;

  Blog.limitNews(page,perPage,function (err, blogs) { //根据page查询返回perPage条博文
    if (err) {
        return next(err);
    }
    //console.log(news);
    res.render('client/blog', {
      title: '主页',
      blogs: blogs.data,
      current_page: page,
      count:blogs.count
    });
  });
}

exports.showClientBlogPage = function(req, res) {
	Blog.findByID(req.query.id, function (err, blog) {
		if(err) {
			return next(err);
		}
		//解析 markdown 为 html	
  	blog.desc = markdown.toHTML(blog.desc);
  	console.log(blog.desc);	
		res.render('client/blogPage', {
      title: '主页',
      blog: blog
    });
	})
}