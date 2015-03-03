var app = angular.module("APP", ["ngRoute"]);
app.run(["$rootScope", "$location", function($rootScope, $location) {
  return $rootScope.location = $location;
}]);

app.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
  /*$routeProvider.when("/login", {
    templateUrl: "login.html",
    controller: "LoginCtrl"
  });*/
  return $locationProvider.html5Mode(false);
}]);
app.controller("MainCtrl", function($scope, api, $rootScope) {
    var str="";
    api.plainGet("GetJSON", {file_path: str})
    .success(function(data) {
      var obj = data;
      console.log(obj);
      var parent = $(".tree > ul > li.temp");
      drawTree(obj.struts, parent);
      $(".tree>ul ul").hide();
    });
    function drawTree(data,node) {
        //不加这句话item会成全局变量
        var item;
        for(item in data) {
          //console.log(item);
          if(item == "$") {

          }else if (isArray(data[item])){
            var arr = data[item];
            if(arr.length) {
              //console.log(ul);
              //ul.appendTo(node.next());
            }
            for(var i = 0; i < arr.length; i++) {
              var n = node.clone().removeClass("hide temp");
              n.find("span").text(item);
              n.find("span").data("data",arr[i]);
              node.parent().append(n);
              var tmp = arr[i];
              //console.log(tmp);
              var ul=$("<ul>");
              $("<li class='hide temp'><span></span></li>").appendTo(ul);
              ul.appendTo(n);
              drawTree(tmp,ul.find("li:eq(0)"));
            }
          }
        }
    }
    /*
    function getXMLJSON(str) {
        $.ajax({
            url: "../GetJSON",
            type: "GET",
            data: {file_path: str},
            success:function(data){
                try
                {
                    //var obj=JSON.parse(data.jsonstr);
                    var obj = data;
                    console.log(obj);
                    var parent=$(".tree > ul > li.temp");
                    //$(".tree > ul > li").find("span").text(obj["@name"]);
                    drawTree(obj.struts,parent);
                    $(".tree>ul ul").hide();
                    //单击时将节点的属性值显示在表格中
                    $(".tree span").on("click",function(event){
                        var $this = $(this);
                        $("table.attr").data("span",$this);
                        renderTable($this.data("data"));
                        $("table.edit").data("data",$this);
                    });
                    //双击是显示节点的子节点
                    $(".tree span").on("dblclick",function(event) {
                        var $this = $(this);
                        var $ul = $this.parent().children("ul");
                        if ($ul.length > 0) {
                            if($ul.is(":visible")){
                                $ul.slideUp();
                                //$this.children("i").removeClass("fa-minus").addClass("fa-plus");
                            } else {
                                $ul.slideDown();
                                //$this.children("i").removeClass("fa-plus").addClass("fa-minus");
                            }
                        }
                    });
                    //点击按钮调用action完成对配置文件的修改工作
                    $(".editNode").bind("click",function(){
                        var node = $("table.edit").data("data");
                        getNodeInfo(node);
                    });
                }
                catch (error){
                    console.log(error);
                }                           
            } 
        });
    } 
    */       

});
app.factory("api", ["$http", "$q", function($http, $q){
    var _url, api, plainRequest;
    api = function (url, data) {
        return $http({
              method: 'POST',
              url: "/" + url,
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              transformRequest: function(obj) {
                //return obj
                var p;
                var _results = [];
                for (item in obj) {
                    if (obj.hasOwnProperty(item)) {
                        _results.push(encodeURIComponent(item) + "=" + encodeURIComponent(obj[item]));      
                    }
                }
                return _results.join('&');
                //return obj;
              },
              data: data,
              timeout: 20000
        });
    };
    plainPost = function (url, data) {
         return $http({
              method: 'POST',
              url: "/" + url,
              data: data,
              timeout: 20000
        });
    }
    plainGet = function (url, data) {
         return $http({
              method: 'GET',
              url: "/" + url,
              data: data,
              timeout: 20000
        });
    }
    uploadFile = function(file, uploadURL) {
        var formdata = new FormData();
        formdata.append("team", file);
        $http.post(uploadURL, formdata, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function() {
            console.log("upload success");
        })
        .error(function() {
            console.log("upload failure");
        });
    }
    return {
        plainPost: plainPost,
        plainGet: plainGet,
        uploadFile: uploadFile
    }
}]);