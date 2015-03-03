var fs = require('fs');
var Deploy = require("../models/deploy.js");
var Plan = require("../operation/Plan.js");
var fileBlocks = require("./fileBlocks.js").getBlocks;
var assemble = require("./assemble.js").assemble;

exports.getFileList = function(req, res) {
	var start = req.query["prefix"] || "";
	//console.log(start);
	//req.session.files = null;
	fileList = [];
	var path = req.path_param || "E:\\安博思软\\workspace\\HiServiceCRM\\src";
	function walk(path){
	  var dirList = fs.readdirSync(path);
	  dirList.forEach(function(item){
	    if(fs.statSync(path + '\\' + item).isDirectory()){
	      walk(path + '\\' + item);
	    }else {
	      var position = item.length-4;
	      if(item.substr(position) == ".xml") {
	      		//console.log(item);
	      		var tmp = {};
	      		tmp.name = item+"";
	      		tmp.path = path + '\\' + item;
	      		fileList.push(tmp);//应该将文件路径保存下来
	      }
	      
	    }
	  });
	}
	var result = [];
	if(!req.session.files){
		walk(path);
		//console.log("run!");
		req.session.files = fileList;
	} 
	var arr = req.session.files;
	//console.log(start);
	for(var i=0; i<arr.length;i++) {
		var str = arr[i].name+"";
		if(str.toLowerCase().indexOf(start.toLowerCase()) == 0) {
			result.push(arr[i]);
			//console.log(arr[i].item);
		}
		
		//console.log(arr[i].name.toLowerCase().indexOf(start.toLowerCase()));
	}
	if(!start) {
		result = req.session.files;
	}
	res.send({data : result});  
}

exports.getJSON = function(req, res) {
	var prefix = "E:\\安博思软\\workspace\\HiServiceCRM\\src";
	var file = req.body["file_path"] || ".\\struts.xml";
	var str = readFile(file);
	var parseString = require('xml2js').parseString;
	var xml = str;
	parseString(xml, function (err, result) {
	    res.send(result);
	});
}
exports.getPlan = function(req, res) {
	Plan.find({}, function(err, plans) {
		if(err) {
			res.send({"status" : "error"});
		} else {
			res.send({"data" : plans});
		} 
	})
}

exports.changeNode = function(req,res) {
	var s_path = req.body["s-path"] || "package:1 action:2";
	var f_path = req.body["f-path"] || ".\\struts.xml";
	var data = req.body.data;
	var newData = req.body.newData;
	var deploy = new Deploy({
		s_path: s_path,
		f_path: f_path,
		data: data,
		newData : newData
	});
	var flag = deploy.change(f_path);
	//console.log(flag);
	if( flag ) {
		res.send({
			"status": "success",
		});
	} else {
		res.send({
			"status": "fail",
		});
	}
}

exports.uploadFile = function(req,res) {
	//console.log(req.files.grand);
	var file = req.files.grand.path;
	//console.log(req.body.relativePath);
	var TargetFile = "F:\\UploadTarget\\"+req.body.relativePath+req.files.grand.originalFilename;
	var TargetPath = "F:\\UploadTarget\\"+req.body.relativePath;
	//console.log(TargetFile);
	fs.exists(file, function(exist) {
		if(exist) {
			try{
				var readable = fs.createReadStream( file );
				if (!fs.existsSync(TargetPath)) {
					fs.mkdirSync(TargetPath);
				}
	            // 创建写入流
	            var writable = fs.createWriteStream( TargetFile, { flags: 'w+' } );   
	            // 通过管道来传输流
	            readable.pipe( writable );
			}
			catch(error) {
				console.log(error);
			}
		} else {
			//console.log("不存在");
			res.send({
				"status": "fail"
			});
		}
	});
	res.send({
		"status": "success"
	});
}

exports.getBlocks = fileBlocks;
exports.assemble = assemble;
function readFile(file){  
    return fs.readFileSync(file, "utf-8");
} 
