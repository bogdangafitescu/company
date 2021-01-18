testApp.controller('salariiController', function ($scope, $http) {
    $scope.computeNet = function () {
        let gross = parseFloat($scope.payoff.gross);
        if (isNaN(gross)) {
            $scope.payoff.net = "";
        } else {
            $scope.payoff.net = parseFloat(((gross/5) * 3).toFixed(2));
        }
    }
});
