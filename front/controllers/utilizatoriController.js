testApp.controller('utilizatoriController', function ($scope, $http, user) {
    let usersCollection = [],
        isEditing = false;

    $http({
        url: 'http://localhost:4000/api/users.php',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: `action=get_all&token=${user.getID()}`
    }).then(function(response) {
        if(response.data.length > 0) {
            usersCollection = $scope.users = response.data;
        }
    });

    $scope.saveUser = function () {
        let isValiForSaving = true;
        if ("undefined" !== typeof $scope.user) {
            for (let propertyName in $scope.user) {
                if ($scope.user[propertyName].length < 1) {
                    isValiForSaving = false;
                }
            }
        } else {
            isValiForSaving = false;
        }

        if (isValiForSaving) {
            let newUser = {};

            if (!angular.equals({}, $scope.user)) {
                let udata = `action=save&name=${$scope.user.name}&pass=${$scope.user.pass}&token=${user.getID()}`;
                if (isEditing !== false) {
                    udata += `&uid=${$scope.user.uid}`;
                }
                $http({
                    url: 'http://localhost:4000/api/users.php',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: udata
                }).then(function(response) {
                    if (isEditing !== false) {
                        if (response.data.status !== "error") {
                            usersCollection[isEditing] = $scope.user;
                            isEditing = false;
                        }
                    } else {
                        newUser = $scope.user;
                        newUser.uid = response.data.uid;
                        usersCollection.push(newUser);
                    }

                    $scope.users = usersCollection;
                    $scope.user = {};
                });
            }
        }
    };

    $scope.editUser = function (usr) {
        isEditing = usersCollection.indexOf(usr);
        $scope.user = angular.copy(usr);
    };

    $scope.removeUser = function (usr) {
        if (confirm('Esti sigur ca doresti sa stergi acest utilizator?')) {
            $http({
                url: 'http://localhost:4000/api/users.php',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: `action=delete&uid=${usr.uid}&token=${user.getID()}`
            }).then(function (response) {
                if (response.data.status !== "error") {
                    let index = usersCollection.indexOf(usr);
                    usersCollection.splice(index, 1);
                    $scope.user = {};
                    if (usersCollection.length === 0) {
                        $scope.users = undefined;
                    }
                }
            });
        }
    };

    $scope.clearForm = function () {
        $scope.user = {};
        isEditing = false;
    };
});

testApp.service('user', function() {
    var username,
        id,
        loggedin = false;

    this.setName = function(name) {
        username = name;
    };

    this.getName = function() {
        return username;
    };

    this.setID = function(userID) {
        id = userID;
    };

    this.getID = function() {
        return id;
    };

    this.loggedIn = function() {
        loggedin = true;
    };

    this.isLoggedIn = function() {
        if(!!localStorage.getItem('login')) {
            loggedin = true;
            var data = JSON.parse(localStorage.getItem('login'));
            username = data.username;
            id = data.id;
        }
        return loggedin;
    };

    this.saveData = function(data) {
        username = data.user;
        id = data.id;
        loggedin = true;
        localStorage.setItem('login', JSON.stringify({
            username: username,
            id: id
        }));
    };

    this.clearData = function() {
        localStorage.removeItem('login');
        username = "";
        id = "";
        loggedin = false;
    }
});