// Controller of menu dashboard page.
appControllers.controller('menuDashboardCtrl', function ($scope, $state, $mdToast, localStorage, $ionicPopup) {
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
    };// End showToast.

    $scope.letsGo = function (l) {
        $state.go(l);
    };

    $scope.signout = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Confirm Actions',
            template: 'Are you sure you want to continue with Sign Out?'
        });

        confirmPopup.then(function(res) {
            if(res) {
                localStorage.removeAll();
                localStorage.set('su','https://www.crowdwaka.com/crowdwaka-312198974560.php');
                localStorage.set('first-launch','1');
                $state.go('app.Login');
            } else {
                return;
            }
        });

    };


});// End of controller menu dashboard.