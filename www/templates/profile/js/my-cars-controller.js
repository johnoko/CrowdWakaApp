appControllers.controller('carCtrl', function ($scope, $mdToast, $mdDialog, localStorage, $http, ionLoading, $timeout, $state) {
    $scope.$on('$ionicView.enter', function () {
        $scope.onLoadMyCars();
    });

    $scope.onLoadMyCars = function () {
        $http.
    }
});