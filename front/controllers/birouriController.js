testApp.controller('birouriController', function ($scope, $http) {
    let officesCollection = [],
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

    $scope.saveOffice = function () {
        if ("undefined" !== typeof $scope.office && $scope.office.name.length > 0) {
            let newOffice = {};

            if (!angular.equals({}, $scope.office)) {
                let odata = `action=save&name=${$scope.office.name}`;
                if (isEditing !== false) {
                    odata += `&oid=${$scope.office.oid}`;
                }
                $http({
                    url: 'http://localhost:4000/api/offices.php',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: odata
                }).then(function(response) {
                    if (isEditing !== false) {
                        if (response.data.status !== "error") {
                            officesCollection[isEditing] = $scope.office;
                            isEditing = false;
                        }
                    } else {
                        newOffice = $scope.office;
                        newOffice.oid = response.data.oid;
                        officesCollection.push(newOffice);
                    }

                    $scope.offices = officesCollection;
                    $scope.office = {};
                    $scope.error = '';
                });
            }
        } else {
            $scope.error = 'Formular invalid!';
        }
    };

    $scope.editOffice = function (ofc) {
        isEditing = officesCollection.indexOf(ofc);
        $scope.office = angular.copy(ofc);
    };

    $scope.removeOffice = function (ofc) {
        if (confirm('Esti sigur ca doresti sa stergi acest birou?')) {
            $http({
                url: 'http://localhost:4000/api/offices.php',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: `action=delete&oid=${ofc.oid}`
            }).then(function (response) {
                if (response.data.status !== "error") {
                    let index = officesCollection.indexOf(ofc);
                    officesCollection.splice(index, 1);
                    $scope.office = {};
                    if (officesCollection.length === 0) {
                        $scope.offices = undefined;
                    }
                }
            });
        }
    };
});
