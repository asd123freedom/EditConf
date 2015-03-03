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
    plainRequest = function (url, data) {
         return $http({
              method: 'POST',
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
        plainRequest: api,
        getTemplate: getTemplate,
        uploadFile: uploadFile
    }
}]);