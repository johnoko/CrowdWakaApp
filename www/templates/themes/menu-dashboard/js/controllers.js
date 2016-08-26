// Controller of menu dashboard page.
appControllers.controller('menuDashboardCtrl', function ($scope, $state, $mdToast, localStorage) {
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

    $scope.signout = function () {
        localStorage.removeAll();
        localStorage.set('su','https://www.crowdwaka.com/crowdwaka-312198974560.php');
        localStorage.set('first-launch','1');
        $state.go('app.Login');
    }
});// End of controller menu dashboard.