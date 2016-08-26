//Controller for all ride specific pages
appControllers.controller('rideCtrl', function ($scope, $mdToast, $mdDialog) {
    $scope.search = function (s) {
        if((typeof s.from != 'undefined') && (typeof s.to != 'undefined')){
            $scope.test();
        }
        else{
            $scope.errorMessage = 'Please ensure that you have the search criteria...'
        }
    };
    $scope.test = function () {
        $scope.found = 'yes';
    }
});