var fs = require('fs');
var md5 = require('blueimp-md5').md5;
var crypto=require("crypto");
//var md5 = crypto.createHash('md5');
var file_path; //文件路径
var list_rolling; //弱校验列表
var list_md5; //强校验列表
var hash_map; //hash表
var hash_index;
var prefix = "F:\\result\\";
var size = 0; //文件分块大小
exports.getBlocks = function(req, res) {
    list_rolling = []; //弱校验列表
    list_md5 = []; //强校验列表
    hash_map = {}; //hash表
    hash_index = {};
    file_path = req.query["fpath"];
    console.log(file_path);
    size = req.query["size"];
    size = parseInt(size);
    console.log(size);
    try {
         var content = readFile(prefix+file_path);
         content = content.trim();
    } catch (e) {
         console.log(e);
         //return;
    }
    var blocks = [];
    if(content.length < size) {
        res.send({
            direct:true
        })
        return;
    }
    for(var i = 0;i < content.length-size;){      
        var temp = content.substring(i,i+size);
        blocks.push(temp);
        var checksum = adler32(temp);
        if(i==0) {
            //console.log(checksum+"asd");
        }
        list_rolling.push(checksum);
        //md5.update(temp);
        var val_md5 = md5(temp);
        list_md5.push(val_md5);
        //md5 = crypto.createHash('md5');
        hash_map[val_md5] = temp;
        i = i+size; 
    }
    for(var i = 0;i<list_md5.length;i++) {
        hash_index[i] = list_md5[i];
    }
    if(true){
        //req.session[file_path] = hash_map;
        req.session[file_path] = {
            "table": hash_map,
            "index": hash_index
        }
        console.log(req.session[file_path]["index"] == undefined);
    }
    console.log(list_rolling.length);
    res.send({
        l: list_rolling,
        l_md5 : list_md5
    });
}
function readFile (file) {  
    return fs.readFileSync(file, "utf-8");
}
function adler32 (data) {
    var MOD_ADLER=65521;
    var a=0;
    var b=0;
    for(var index=0;index < data.length;++index){
        a=(a + data.charCodeAt(index)) % MOD_ADLER;
        b=(b + a) % MOD_ADLER;
    }
    //console.log(b);
    //console.log(a);
    return (b * 65536) + a;
}; 
/*
for (var i = 0; i < str.length; ++i)
{
    charCode = str.charCodeAt(i);
    bytes.push((charCode & 0xFF00) >> 8);
    bytes.push(charCode & 0xFF);
}
*/