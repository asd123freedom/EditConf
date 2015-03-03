
/*
 * GET home page.
 */

// exports.index = function(req, res){
//   res.render('index', { title: 'Express' });
// };
var crypto=require("crypto");
var User=require("../models/user.js");
var controller = require("../controllers/index");

module.exports=function(app){
	app.get("/",function(req,res){
		res.render('index', { title: '主页' });
	});
	app.get("/reg",function(req,res){
		res.render('reg', { title: '注册' });
	});
	app.post("/reg",function(req,res){
		var name=req.body.name,
			password=req.body.password,
			password_re=req.body['password-repeat'];
		console.log(password);
		console.log(password_re);
		if(password_re!=password){
			req.flash('error',"密码不一致");
			return res.redirect("/reg");
		}
		var md5=crypto.createHash('md5');
		password=md5.update(req.body.password).digest("hex");
		var newUser=new User({
			name:name,
			password:password,
			email:req.body.email
		});
		User.get(newUser.name,function(err,user){
			if(user){
				req.flash("error","user exists");
				return res.redirect("/reg");
			}
			newUser.save(function(err,user){
				if(err){
					req.flash("error",err);
					return res.redirect("/reg");
				}
				req.session.user=user;
				req.flash("success",'注册成功');
				res.redirect("/");
			});
		});
	});
	app.get("/login",function(req,res){
		res.render('login', { title: '登录' });
	});
	app.get("/deploy",function(req,res){
		req.session.files = null;
		res.render("onedrive.html");
	});
	app.get("/angular", function (req, res) {
		res.render("index.html");
	});
	app.post("/login",function(req,res){

	});
	app.get("/post",function(req,res){
		res.render('post', { title: '发表' });
	});
	app.post("/post",function(req,res){

	});
	app.get("/logout",function(req,res){

	});
	app.get("/FileList", controller.getFileList);
	app.get("/GetJSON", controller.getJSON);
	app.post("/ChangeNode", controller.changeNode);
	app.get("/GetPlan", controller.getPlan);
	app.get("/GetBlocks", controller.getBlocks);
	app.post("/Assemble", controller.assemble);
	app.post("/Upload", controller.uploadFile);
}