// Controller of catalog Page.
appControllers.controller('authCtrl', function ($scope, $http, $state, $mdToast, $mdDialog, localStorage, ionLoading, $base64, $ionicSideMenuDelegate) {
    $ionicSideMenuDelegate.canDragContent(false);

    $scope.login = function (loginData) {
        $scope.deviceInformation = ionic.Platform.device();
        ionLoading.show();
        var su = localStorage.get('su');
        console.log(localStorage.get('su') + '?type=login&vEmail=' + loginData.email + '&vPassword=' + loginData.password + '&vDeviceType=Android');
        $http.get(localStorage.get('su') + '?type=login&vEmail=' + loginData.email + '&vPassword=' + loginData.password + '&vDeviceType=Android')
            .success(function (response, status, headers, config) {
                console.log(response[0].action);
                //console.log(status);
                if (status == 200) {
                    if (response[0].action == 1) {
                        var loginValidator = response[0].vEmail + response[0].iMemberId + response[0].vFirstName;
                        $scope.loginvalidatorEncoded = $base64.encode(loginValidator);

                        localStorage.set('deviceID', $scope.deviceInformation.uuid);
                        localStorage.set('sik', $scope.loginvalidatorEncoded);
                        localStorage.set('memberid', response[0].iMemberId);
                        localStorage.set('email', response[0].vEmail);
                        localStorage.set('fname', response[0].vFirstName);
                        localStorage.set('lname', response[0].vLastName);
                        localStorage.set('pimage', response[0].vImage);
                        localStorage.set('fbid', response[0].iFBId);
                        //lets check if the user is verified
                        $http.get(localStorage.get('su') + '?type=personal_information&MemberId=' + response[0].iMemberId + '&lang_pref=EN')
                            .success(function (res) {
                                if (res.personal_information.eEmailVarified == 'No') {
                                    ionLoading.hide();
                                    $state.go('app.profile');
                                }
                                if (res.personal_information.ePhoneVerified == 'No') {
                                    ionLoading.hide();
                                    $state.go('app.profile');
                                }
                            });
                        ionLoading.hide();
                        $state.go('app.menuDashboard');
                    }
                    else {
                        ionLoading.hide();
                        $scope.isLoginFailed = 1;
                    }
                }
            }).error(function (err, status) {
            ionLoading.hide();
            $scope.isLoginFailed = 2;
        });
        //$state.go('app.dashboard');
    };

    $scope.recoverPassword = function (loginData) {
        ionLoading.show();
        var su = localStorage.get('su');
        //$http.get(localStorage.get('su')+'?type=login&vEmail='+loginData.email+'&vDeviceType=Android&vDeviceToken='+localStorage.get('deviceID'))
        $http.get(localStorage.get('su') + '?type=forgotpass&vEmail=' + loginData.email + '&vDeviceType=Android')
            .success(function (response, status, headers, config) {
                console.log(response[0].action);
                console.log(status);
                if (status == 200) {
                    if (response[0].action == 1) {
                        ionLoading.hide();
                        $scope.isLoginFailed = 1;
                    }
                    else {
                        ionLoading.hide();
                        $scope.isLoginFailed = 3;
                    }
                }
            }).error(function (err, status) {
            ionLoading.hide();
            $scope.isLoginFailed = 3;
        });
        //$state.go('app.dashboard');
    };

    $scope.showAlert = function ($content) {
        var alert = $mdDialog.alert({
            title: 'Message',
            content: $content,
            ok: 'Close'
        });
        $mdDialog
            .show(alert);
    }

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

    $scope.register = function (r) {
        ionLoading.show();
        //$scope.registerUrl=localStorage.get('su')+"?type=register&vEmail="+r.vEmail+"&vFirstName="+r.vFirstName+"&vLastName="+r.vLastName+"&vPassword="+r.vPassword+"&vLanguageCode=EN"+"&vDeviceType=Android"+"&vDeviceToken="+localStorage.devicetoken;
        $scope.registerUrl = localStorage.get('su') + "?type=register&vEmail=" + r.vEmail + "&vFirstName=" + r.vFirstName + "&vLastName=" + r.vLastName + "&vPassword=" + r.vPassword + "&vLanguageCode=EN" + "&vDeviceType=Android";
        $http.get($scope.registerUrl)
            .success(function (response) {
                if (response.action == "1") {
                    var loginValidator = response.vEmail + response.iMemberId + response.vFirstName;
                    $scope.loginvalidatorEncoded = $base64.encode(loginValidator);

                    //Only uncommnt the below for apps on Actual Devices
                    //localStorage.set('deviceID',$scope.deviceInformation.uuid);
                    localStorage.set('sik', $scope.loginvalidatorEncoded);
                    localStorage.set('memberid', response.iMemberId);
                    localStorage.set('email', response.vEmail);
                    localStorage.set('fname', response.vFirstName);
                    localStorage.set('lname', response.vLastName);
                    localStorage.set('pimage', response.vImage);
                    ionLoading.hide();
                    $state.go('app.menuDashboard');
                }
                else {
                    if (response.message != "") {
                        $scope.errorMessage = response.message;
                    }
                    else {
                        $scope.errorMessage = "Something went wrong in registration. please try again";
                    }
                }
            });
    }

});// End of catalog controller.
