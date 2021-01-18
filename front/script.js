var testApp = angular.module('testApp', ['ngRoute']);

testApp.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl : 'pages/login.html',
            controller  : 'loginController'
        })

        .when('/birouri', {
            resolve: {
                check: function($location, user) {
                    if(!user.isLoggedIn()) {
                        $location.path('/login');
                    }
                },
            },
            templateUrl : 'pages/birouri.html',
            controller  : 'birouriController'
        })

        .when('/utilizatori', {
            resolve: {
                check: function($location, user) {
                    if(!user.isLoggedIn()) {
                        $location.path('/login');
                    }
                },
            },
            templateUrl : 'pages/utilizatori.html',
            controller  : 'utilizatoriController'
        })

        .when('/departamente', {
            templateUrl : 'pages/departamente.html',
            controller  : 'departamenteController'
        })

        .when('/salariati', {
            templateUrl : 'pages/salariati.html',
            controller  : 'salariatiController'
        })

        .when('/salarii', {
            templateUrl : 'pages/salarii.html',
            controller  : 'salariiController'
        })

        .when('/login', {
            templateUrl : 'pages/login.html',
            controller  : 'loginController'
        })

        .when('/logout', {
            resolve: {
                deadResolve: function ($location, user, $http) {
                    if (user.isLoggedIn()) {
                        $http({
                            url: 'http://localhost:4000/api/users.php',
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            data: 'action=logout&sid=' + user.getID()
                        }).then(function (response) {
                            if (response.data.status == 'success') {
                                user.clearData();
                                $location.path('/login');
                            }
                        });
                    }
                }
            }
        })

        .otherwise({
            template: '404 - Page not found'
        });
    $locationProvider.html5Mode(true);
});

testApp.controller('mainController', function($scope) {
    $scope.message = 'Pagina birouri';
});

testApp.controller('birouriController', function($scope) {
    $scope.message = 'Pagina birouri';
});

testApp.controller('departamenteController', function($scope) {
    $scope.message = 'Pagina departamente';
});

testApp.controller('salariatiController', function($scope) {
    $scope.message = 'Pagina salariati';
});

testApp.controller('salariiController', function($scope) {
    $scope.message = 'Pagina salarii';
});

testApp.controller('loginController', function($scope, $location, $http, user) {
    $scope.userLoggedIn = user.isLoggedIn();
    $scope.user = user.getName();
    $scope.formSubmit = function(loginForm) {
        var username = loginForm.$$controls[0].$viewValue;
        var password = loginForm.$$controls[1].$viewValue;
        $http({
            url: 'http://localhost:4000/api/users.php',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'action=login&username='+username+'&password='+password
        }).then(function(response) {
            if(response.data.status == 'loggedin') {
                user.saveData(response.data);
                $location.path('/birouri');
            } else {
                $scope.error = "Utilizator sau parola gresit(a) !";
            }
        });
    };

});
