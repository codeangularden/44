var app = angular.module('app', ['ngRoute', 'checklist-model']);
app.constant('myConst', { url: 'http://localhost:37403/' });

app.config(function ($routeProvider) {
    $routeProvider.when('/Add', {
        templateUrl: 'addEmp.html',
        controller: 'addController'
    })
    .when('/list', {
        templateUrl: 'listEmp.html',
        controller: 'listController'
    })
    .otherwise({ redirect: '/list' });

});


app.controller('addController', function ($scope, $http, $window, $routeParams) {
    $scope.emp = {};

    $scope.fromsave = true;
    $scope.fromedit = false;

    $scope.hobbies = ['cricket', 'reading', 'swimming', 'hockey'];

    $scope.savetolocal = function () {
        var arr = [];

        $scope.emp.EmpId = new Date().valueOf();

        var data = $window.localStorage['empl'];

        if (angular.isUndefined(data))
        { arr = []; }
        else {
            arr = angular.fromJson(data);
        }

        arr.push($scope.emp);

        $window.localStorage['empl'] = angular.toJson(arr);

        $scope.emp = {};

        $scope.getfromlocal();
    };

    $scope.getfromlocal = function () {

        var list = [];

        var data = $window.localStorage['empl'];

        if (angular.isUndefined(data)) {
            list = [];
        }
        else {
            list = angular.fromJson(data);
        }

        $scope.empList = list;

    };



    $scope.edit = function (x) {

        $scope.fromsave = false;
        $scope.fromedit = true;

        $scope.emp.bday = new Date(x.bday);
        $scope.emp = x;

    };

    $scope.edittolocal = function () {

        var data = $window.localStorage['empl'];

        if (angular.isUndefined(data)) {
            list = [];
        }
        else {
            list = angular.fromJson(data);
        }

        for (var i = 0; (list.length - 1); i++) {

            if (list[i].EmpId == $scope.emp.EmpId) {

                list[i] = $scope.emp;
                break;
            }
        }

        $window.localStorage['empl'] = [];

        $window.localStorage['empl'] = angular.toJson(list);

        $scope.emp = {};

        $scope.fromsave = true;
        $scope.fromedit = false;
    };

    $scope.deletefromlocal = function (obj) {

        var data = $window.localStorage['empl'];

        if (angular.isUndefined(data)) {
            list = [];
        }
        else {
            list = angular.fromJson(data);
        }

        for (var i = 0; (list.length - 1); i++) {

            if (list[i].EmpId == obj.EmpId) {

                list.splice(i, 1);
                break;
            }
        }

        $window.localStorage['empl'] = [];

        $window.localStorage['empl'] = angular.toJson(list);

        $scope.emp = {};

        $scope.getfromlocal();
    };

    $scope.getfromlocal();



    $scope.synctodb = function () {

        var data = $window.localStorage['empl'];

        if (angular.isUndefined(data)) {
            list = [];
        }
        else {
            list = angular.fromJson(data);
        }


        $http({
            url: "Home/syncToDB",
            method: "POST",
            data: { obj: angular.toJson(list) }
        }).success(function (data) {
            $window.localStorage.removeItem('empl');
        })
        .error(function (error) {
        });
    };


    $scope.Refresh = function () {

        $http.get('Home/getdata').success(function (data) {

            $scope.empListdb = angular.fromJson(data);
        })
         .error(function (error) {
         });
    };

    $scope.editdb = function () {

        $http({
            url: "Home/updatedb",
            method: "POST",
            data: { obj: angular.toJson($scope.emp) }
        }).success(function (data) {
            $scope.Refresh();
        })
        .error(function (error) {
        });
    };

    $scope.savedb = function () {

        $scope.emp.EmpId = new Date().valueOf();

        $http({
            url: "Home/savedata",
            method: "POST",
            data: { obj: angular.toJson($scope.emp) }
        }).success(function (data) {
            $scope.Refresh();
        })
        .error(function (error) {
        });
    };

    $scope.deletefromdb = function (objid) {

        $http({
            url: 'Home/deletedb',
            method: 'POST',
            data: { obj: objid }
        }).success(function (data) {
            $scope.Refresh();
        })
        .error(function (error) {
        });
    };

    $scope.sortasc = true;
    $scope.sortcoloumn = 'EmpCode';
    $scope.sortorder = function (col) {

        $scope.sortasc = ($scope.sortcoloumn === col) ? !$scope.sortasc : false;
        $scope.sortcoloumn = col;


        //        if ($scope.sortcoloumn == col) {
        //            $scope.sortasc = !$scope.sortasc;
        //        }
        //        else {
        //            $scope.sortasc = true;
        //        }

        //        $scope.sortcoloumn = col;

    };


    $scope.searchFilter = function (obj) {
        var re = new RegExp($scope.searchText, 'i');
        return !$scope.searchText || re.test(obj.EmpCode) || re.test(obj.EmpName);
    };

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
$routeParams.sid
    

public bool syncToCloud(string objToSave, string collectionname)
{
var collection = mongoDB.GetCollection<BsonArray>(collectionname);
var insertbatch = BsonSerializer.Deserialize<BsonArray>(objToSave);

collection.InsertBatch(insertbatch);

return true;
}

[HttpPost]
public bool syncToDB(string obj)
{
return new DbUtility().syncToCloud(obj, "employee");
}

[HttpGet]
public string getdata()
{
return new DbUtility().GetAllDocumentsWithObjectId("employee");
}
        
[HttpPost]
public bool savedata(string obj)
{
return new DbUtility().SaveDocument(obj, "employee");
}

[HttpPost]
public bool updatedb(string obj)
{
return new DbUtility().UpdateDocumentByObjectId(obj, "employee");
}

[HttpPost]
public bool deletedb(string obj)
{
return new DbUtility().DeleteDocumentByObjectId("employee", MongoDB.Bson.ObjectId.Parse(obj));
}
*/
