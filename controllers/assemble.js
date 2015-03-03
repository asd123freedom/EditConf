var fs = require('fs');
var mkdirp = require('mkdirp');
var hash_map;
var hash_index;
exports.assemble = function(req, res) {
    var obj = req.body["match"];
    var path = req.body["f-path"];
    var name = req.body["f-name"];
    var prefix = "F:/result/";
    
    if(req.session[path+name]){
        console.log("cunzai");
        hash_map = req.session[path+name]["table"];
        hash_index = req.session[path+name]["index"];
        req.session[path+name] = null;
    } else {
        res.send({
            "status": "fail"
        });
        return;
    }
    path = prefix + path;
    var left = req.body["left"];
    arr = obj;
    var content = "";
    for (var i = 0; i < arr.length; i++) {
        var type = arr[i]["type"];
        var temp;
        if(type == 1) {
            //temp = hash_map[arr[i]["MD5"]];
            //console.log(temp);
            var num = arr[i]["num"];
            //console.log(num);
            //console.log(hash_index);
            var temp = hash_map[hash_index[num]];
            //console.log(temp);
            content+=temp;
        } else {
            content+= arr[i]["content"];
        }
    }
    content += left;
    //console.log(content);
    mkdirp(path, function (err) {
        if (err){
           console.error(err);
        } 
        else {
            try {
                fs.writeFileSync(path+name, content);
                res.send({
                    "status": "success"
                });
            }
            catch (error){
                console.log(error);
            }  
        }
    });
    //通过写文件的方式更新代码文件
    
    
}