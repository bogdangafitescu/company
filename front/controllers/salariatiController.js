testApp.controller('salariatiController', function ($scope, $http) {
    let employeesCollection = [],
        isEditing = false;

    $http({
        url: 'http://localhost:4000/api/employees.php',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: `action=get_all`
    }).then(function(response) {
        if(response.data.length > 0) {
            employeesCollection = $scope.employees = response.data;
        }
    });

    //get departments and offices
    $http({
        url: 'http://localhost:4000/api/departments.php',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: `action=get_all`
    }).then(function(response) {
        if(response.data.length > 0) {
            $scope.depts = response.data;
        }
    });

    $scope.saveEmployee = function () {
        if ($scope.employees_form.$valid) {
            let newEmployee = {};
            if (!angular.equals({}, $scope.employee)) {
                let isManager = $scope.employee.is_manager == true ? 1 : 0,
                    edata = `action=save&firstname=${$scope.employee.first_name}&lastname=${$scope.employee.last_name}`;
                edata += `&email=${$scope.employee.email}&birth_date=${$scope.employee.birth_date.toLocaleString()}`;
                edata += `&department=${$scope.dept.did}&office=${$scope.offc.oid}&is_manager=${isManager}`;
                if (isEditing !== false) {
                    edata += `&eid=${$scope.employee.eid}`;
                }
                $http({
                    url: 'http://localhost:4000/api/employees.php',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: edata
                }).then(function(response) {
                    if (isEditing !== false) {
                        if (response.data.status !== "error") {
                            let editedEmployee = $scope.employee;
                            editedEmployee.birth_date = editedEmployee.birth_date.toLocaleString().split(",")[0];
                            editedEmployee.did = $scope.dept.did;
                            editedEmployee.department = $scope.dept.name;
                            editedEmployee.oid = $scope.offc.oid;
                            editedEmployee.office = $scope.offc.name;
                            employeesCollection[isEditing] = editedEmployee;
                            isEditing = false;
                        }
                    } else {
                        newEmployee = $scope.employee;
                        newEmployee.eid = response.data.eid;
                        newEmployee.birth_date = newEmployee.birth_date.toLocaleString().split(",")[0];
                        newEmployee.did = $scope.dept.did;
                        newEmployee.department = $scope.dept.name;
                        newEmployee.oid = $scope.offc.oid;
                        newEmployee.office = $scope.offc.name;
                        newEmployee.is_manager = $scope.employee.is_manager;
                        employeesCollection.push(newEmployee);
                    }

                    $scope.employees = employeesCollection;
                    $scope.employee = {};
                    $scope.dept = {};
                    $scope.offc = {};
                    $scope.error = '';
                });
            }
        } else {
            $scope.error = 'Formular invalid!';
        }
    };

    $scope.editEmployee = function (empl) {console.log(empl);
        let options = { month: '2-digit', day: '2-digit' },
            selectedDept,
            selectedOffice;
        isEditing = employeesCollection.indexOf(empl);
        $scope.employee = angular.copy(empl);
        $scope.employee.birth_date = new Date(empl.birth_date);

        $scope.depts.forEach(function (depart) {
            if (depart.did == empl.did) {
                selectedDept = depart;
            }
        });
        $scope.dept = selectedDept;
        $scope.offs = $scope.dept.offices;
        $scope.offc = { oid: empl.oid, name: empl.office };
    };

    $scope.removeEmployee = function (empl) {
        if (confirm('Esti sigur ca doresti sa stergi acest salariat?')) {
            $http({
                url: 'http://localhost:4000/api/employees.php',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: `action=delete&eid=${empl.eid}`
            }).then(function (response) {
                if (response.data.status !== "error") {
                    let index = employeesCollection.indexOf(empl);
                    employeesCollection.splice(index, 1);
                    $scope.employee = {};
                    if (employeesCollection.length === 0) {
                        $scope.employees = undefined;
                    }
                }
            });
        }
    };

    $scope.deptChanged = function () {
        $scope.offs = $scope.dept.offices;
    }
});
