// Controller of catalog Page.
appControllers.controller('authCtrl', function ($scope, $http, $state, $mdToast, $mdDialog, localStorage, ionLoading, $base64, $ionicSideMenuDelegate) {
    $ionicSideMenuDelegate.canDragContent(false);
    $scope.login = function (loginData) {
        ionLoading.show();
        var su = localStorage.get('su');
        $http.get(localStorage.get('su')+'?type=login&vEmail='+loginData.email+'&vPassword='+loginData.password+'&vDeviceType=Android')
            .success(function(response,status,headers,config){
                console.log(response[0].action);
                console.log(status);
                if(status == 200){
                    if(response[0].action == 1)
                    {
                        var loginValidator = response[0].vEmail+response[0].iMemberId+response[0].vFirstName;
                        $scope.loginvalidatorEncoded = $base64.encode(loginValidator);

                        localStorage.set('sik',$scope.loginvalidatorEncoded);
                        localStorage.set('memberid',response[0].iMemberId);
                        localStorage.set('email',response[0].vEmail);
                        localStorage.set('fname',response[0].vFirstName);
                        localStorage.set('lname',response[0].vLastName);
                        localStorage.set('pimage',response[0].vImage);
                        localStorage.set('fbid',response[0].iFBId);
                        ionLoading.hide();
                        $state.go('app.menuDashboard');
                    }
                    else {
                        ionLoading.hide();
                        $scope.isLoginFailed = 1;
                    }
                }
            }).error(function(err,status){
                ionLoading.hide();
                $scope.isLoginFailed = 2;
        });
        //$state.go('app.dashboard');

    };

    // showConfirmDialog for show alert box.
    $scope.showConfirmDialog = function ($event) {
        //mdDialog.show use for show alert box for Confirm Order.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Confirm Order",
                    content: "Confirm to add Order.",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {
            //  For confirm button to Order.

            // Showing Item added.! toast.
            $mdToast.show({
                controller: 'toastController',
                templateUrl: 'toast.html',
                hideDelay: 1200,
                position: 'top',
                locals: {
                    displayOption: {
                        title: "Item added."
                    }
                }
            }); // Ends showing toast.
        }, function () {
            // For cancel button to Order.
        });
    }// End showConfirmDialog.
});// End of catalog controller.