var app = angular.module("APP", ["ngRoute"]);
app.run(["$rootScope", "$location", function($rootScope, $location) {
  return $rootScope.location = $location;
}]);

app.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
  $routeProvider.when("/config", {
    templateUrl: "config.html",
    controller: "ConfigCtrl"
  });
  return $locationProvider.html5Mode(false);
}]);
app.controller("MainCtrl", function($scope, api, $rootScope) {
    $scope.active = function($event) {
          
    }
});
app.controller("ConfigCtrl", function($scope, api, $rootScope) {
    var str="";
    api.plainGet("GetJSON", {file_path: str})
    .success(function(data) {
        var obj = data;
        console.log(obj);
        var parent = $(".tree > ul > li.temp");
        drawTree(obj.struts, parent);
        $(".tree>ul ul").hide();
    });
    $scope.showChild = function ($event) {
        var target = $event.target;
        if(target.nodeName.toLowerCase() == "span") {
            var $ul = $(target).next();
            if($ul.length > 0) {
                if($ul.is(":visible")){
                    $ul.slideUp();
                } else {
                    $ul.slideDown();
                }
            }
        }
    }
    function isArray(arr) {
          return Object.prototype.toString.apply(arr) === "[object Array]";
    }
    function drawTree(data,node) {
        //without this line the itme will be global
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