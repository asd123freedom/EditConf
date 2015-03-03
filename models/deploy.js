var fs = require('fs');
//var file = "../struts.xml";
//var str = readFile(file);
var libxmljs = require('libxmljs');
module.exports=Deploy;
function Deploy(deploy) {
	this.s_path = deploy.s_path;
	this.f_path = deploy.f_path;
	this.data = deploy.data;
	this.newData = deploy.newData;
}
Deploy.prototype.change = function(callback) {
	var file = this.f_path;
	var arr = this.path.split(" ");
	//console.log(arr.length);
	for(var i=0;i<arr.length;i++) {
		if(!arr[i]) {
			arr[i] = false;
			continue;
		}
		var tmp ={};
		var t_arr = arr[i].split(":");
		tmp.name = t_arr[0];
		tmp.index = t_arr[1];
		console.log(tmp.index);
		arr[i] = tmp;
	}
	//console.log(tmp);
	var xpath = "//";
	for(i=0;i<arr.length;i++) {
		if(!arr[i]) {
			continue;
		}
		tmp = arr[i];
		xpath +=tmp.name+"["+tmp.index+"]";
	}
	//console.log(xpath);
	var doc = libxmljs.parseXmlString(fs.readFileSync(file, "utf-8"),{ noblanks: true });
	var node = doc.get(xpath);
	var item = "";
	var flag = true;
	for(item in this.data) {
		var value;
		if(item == "@text" && this.data["@text"]) {
			value = this.data["@text"];
			if(value != node.text()) {
				flag =false;
				break;
			}
		}else {
			value = this.data[item];
			//console.log(value);
			if(value != node.attr(item).value()) {
				flag =false;
				break;
			}

		}
	}
	if(!flag) {
		return false;
	}
	if(this.newData.hasOwnProperty("@text")) {
		node.text(newData["@text"]);
	} else {
		delete this.newData["@text"];
		node.attr(this.newData);
	}
	//通过写文件的方式更新配置文件
	try {
		fs.writeFileSync("../struts2.xml", doc.toString());
		return true;
	}
	catch (error){
        console.log(error);
        return false;
    }      

}
//用到的两个工具函数
function readFile(file){  
    return fs.readFileSync(file, "utf-8");
}
function writeFile(file,str){  
    // 测试用的中文  
    str = str || "Error";  
    // 把中文转换成字节数组  
    //var arr = iconv.encode(str, 'gbk');   
      
    // appendFile，如果文件不存在，会自动创建新文件  
    // 如果用writeFile，那么会删除旧文件，直接写新文件  
    fs.writeFile(file, str, function(err){  
        if(err)  
            console.log("fail " + err);  
        else  
            console.log("写入文件ok");  
    });  
}
