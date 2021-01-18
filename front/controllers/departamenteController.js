testApp.controller('departamenteController', function ($scope, $http) {
    let deptsCollection = [],
        officesCollection = [],
        isEditing = false;

    $http({
        url: 'http://localhost:4000/api/offices.php',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: `action=get_all`
    }).then(function(response) {
        if(response.data.length > 0) {
            officesCollection = $scope.offices = response.data;
        }
    });

    $http({
        url: 'http://localhost:4000/api/departments.php',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: `action=get_all`
    }).then(function(response) {
        if(response.data.length > 0) {
            deptsCollection = response.data;
            deptsCollection.forEach(function (dept) {
                var officeNames = '';
                dept.offices.forEach(function (office) {
                    if (officeNames != "") {
                        officeNames += ", ";
                    };
                    officeNames += office.name;
                });
                dept.officeNames = officeNames;
            });
            $scope.depts = deptsCollection;
        }
    });

    $scope.saveDept = function () {
        if ("undefined" !== typeof $scope.dept && $scope.dept.name.length > 0 && $scope.offs) {
            let newDept = {};

            if (!angular.equals({}, $scope.dept)) {
                let ddata = `action=save&name=${$scope.dept.name}`,
                    officeIdsString = '';

                if ($scope.offs.length) {
                    $scope.offs.forEach(function (off) {
                        if (officeIdsString != "") {
                            officeIdsString += ", ";
                        }
                        officeIdsString += off.oid;
                    });
                }

                ddata += `&offices=${officeIdsString}`;

                if (isEditing !== false) {
                    ddata += `&did=${$scope.dept.did}`;
                }
                $http({
                    url: 'http://localhost:4000/api/departments.php',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: ddata
                }).then(function(response) {
                    let savedDept = $scope.dept,
                        officeNames = '';
                    savedDept.offices = $scope.offs;
                    savedDept.offices.forEach(function (office) {
                        if (officeNames != "") {
                            officeNames += ", ";
                        };
                        officeNames += office.name;
                    });
                    savedDept.officeNames = officeNames;

                    if (isEditing !== false) {
                        if (response.data.status !== "error") {
                            deptsCollection[isEditing] = savedDept;
                            isEditing = false;
                        }
                    } else {
                        savedDept.did = response.data.did;
                        deptsCollection.push(savedDept);
                    }

                    $scope.depts = deptsCollection;
                    $scope.dept = {};
                    $scope.offs = [];
                    $scope.error = '';
                });
            }
        } else {
            $scope.error = 'Formular invalid!';
        }
    };

    $scope.editDept = function (dep) {
        isEditing = deptsCollection.indexOf(dep);
        $scope.dept = angular.copy(dep);
        $scope.offs = dep.offices;
    };

    $scope.removeDept = function (dep) {
        if (confirm('Esti sigur ca doresti sa stergi acest departament?')) {
            $http({
                url: 'http://localhost:4000/api/departments.php',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: `action=delete&did=${dep.did}`
            }).then(function (response) {
                if (response.data.status !== "error") {
                    let index = deptsCollection.indexOf(dep);
                    deptsCollection.splice(index, 1);
                    $scope.dept = {};
                    if (deptsCollection.length === 0) {
                        $scope.depts = undefined;
                    }
                }
            });
        }
    };
});
