// Controller of menu dashboard page.
appControllers.controller('menuDashboardCtrl', function ($scope, $state, $mdToast) {
    //ShowToast for show toast when user press button.
    $scope.showToast = function (menuName) {
        //Calling $mdToast.show to show toast.
        $mdToast.show({
            controller: 'toastController',
            templateUrl: 'toast.html',
            hideDelay: 800,
            position: 'top',
            locals: {
                displayOption: {
                    title: 'Going to ' + menuName + " !!"
                }
            }
        });
    }// End showToast.

    $scope.letsGo = function (l) {
        $state.go(l);
    }
});// End of controller menu dashboard.