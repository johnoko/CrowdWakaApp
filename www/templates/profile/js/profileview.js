appControllers.controller('profileViewCtrl', function ($scope, $mdToast, $mdDialog, localStorage, $http, ionLoading, $timeout, $state, $ionicPopup) {
    $scope.$on('$ionicView.enter', function () {
        $scope.onLoadMe();
    });
    $scope.pimage = localStorage.get('pimage');
    $scope.name = {
        'first': localStorage.get('fname'),
        'last': localStorage.get('lname'),
        'full': localStorage.get('fname') + ' ' + localStorage.get('lname')
    };

    $scope.onLoadMe = function () {
        ionLoading.show();
        //console.log(localStorage.get('su') + '?type=personal_information&MemberId=' + localStorage.get('memberid') + '&lang_pref=EN');
        $http.get(localStorage.get('su') + '?type=personal_information&MemberId=' + localStorage.get('memberid') + '&lang_pref=EN')
            .success(function (response) {
                //get all data to be displayed
                //console.log(response);
                //for the edit page
                $scope.editProfile = {
                    'personal': response.personal_information,
                    'car': response.car_detail
                };

                //for the view page
                $scope.rating = response.personal_information.rating;
                $scope.ratingmax = 5;
                $scope.desc = response.personal_information.tDescription;
                $scope.phone = response.personal_information.vPhone;
                $scope.isPhoneVerified = response.personal_information.ePhoneVerified;
                $scope.email = response.personal_information.vEmail;
                $scope.isEmailVerified = response.personal_information.eEmailVarified;
                $scope.isAllVerified = function (e, p) {
                    return !(e === 'Yes' || p === 'Yes');
                };
                $scope.ridePreferences = {
                    'smoking': {
                        'icon': response.personal_information.Smoking,
                        'title': response.personal_information.Smoking_Lable
                    },
                    'music': {
                        'icon': response.personal_information.Music,
                        'title': response.personal_information.Music_Lable
                    },
                    'chattiness': {
                        'icon': response.personal_information.Chattiness,
                        'title': response.personal_information.Chattiness_Lable
                    },
                    'pets': {
                        'icon': response.personal_information.Pets,
                        'title': response.personal_information.Pets_Lable
                    }
                };
                ionLoading.hide();
            });
    };

    $scope.goto = function (l) {
        $state.go(l)
    };

    $scope.verifyPhone = function (p) {
        var memberid = localStorage.get('memberid');
        var emailCodeURL = localStorage.get('su') + "?type=send_sms&iMemberId=" + memberid;
        ionLoading.show();
        $http.get(emailCodeURL).success(function (response) {
            //console.log(response);
            if (response[0].action == 1) {
                //show form field for verify
                $scope.verifyFail = 0;
                ionLoading.hide();
                //$scope.vCode = response[0].vCode;
                //$scope.showPhonePrompt('Verify Your Phone Number','Please enter the code you got as an SMS.');
            } else {
                $scope.verifyFail = 1;
                console.log(response[0].message);
                ionLoading.hide();
            }
        });
    };

    $scope.showPhonePrompt = function (phone, title, content) {
        $scope.data = {};

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.code"><br/><div class="text-center"><a style="color:#fff !important;" class="md-button md-default-theme md-warn" ng-click="verifyPhone(phone)">Resend SMS</a></div>',
            title: title,
            subTitle: content,
            scope: $scope,
            buttons: [
                {text: 'Cancel'},
                {
                    text: '<b>Verify</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!$scope.data.code) {
                            //don't allow the user to close unless he enters the code
                            e.preventDefault();
                        } else {
                            ionLoading.show();
                            $http.get(localStorage.get('su') + "?type=verify_phone_code&iMemberId=" + localStorage.get('memberid') + "&vCode=" + $scope.data.code)
                                .success(function (cResponse) {
                                    $scope.msg = cResponse[0].message;
                                    if (cResponse[0].action == 1) {
                                        $scope.phoneVerificationIsSuccessfull = 1;
                                        console.log('verified');
                                        ionLoading.hide();
                                        $scope.successAlert('Success', $scope.msg);
                                    }
                                    else {
                                        $scope.phoneVerificationIsSuccessfull = 0;
                                        ionLoading.hide();
                                        $scope.successAlert('Error', $scope.msg);
                                        console.log('not verified');
                                    }
                                });
                        }
                    }
                }
            ]
        });

        myPopup.then(function (res) {
            console.log('Code saved!', res);
        });

        // $timeout(function() {
        //    myPopup.close(); //close the popup after 3 seconds for some reason
        // }, 3000);
    };

    $scope.verifyEmail = function (email) {
        var memberid = localStorage.get('memberid');
        var emailCodeURL = localStorage.get('su') + "?type=verify_email&iMemberId=" + memberid;
        ionLoading.show();
        $http.get(emailCodeURL).success(function (response) {
            //console.log(response);
            if (response[0].action == 1) {
                //show form field for verify
                $scope.verifyFail = 0;
                ionLoading.hide();
                //$scope.vCode = response[0].vCode;
                //$scope.showPhonePrompt('Verify Your Phone Number','Please enter the code you got as an SMS.');
            } else {
                $scope.verifyFail = 1;
                console.log(response[0].message);
                ionLoading.hide();
                alert('error sending messages. Please try again.')
            }
        });
    };

    $scope.showEmailPrompt = function (email, title, content) {
        $scope.data = {};

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.ecode"><br/><div class="text-center"><a style="color:#fff !important;" class="md-button md-default-theme md-warn" ng-click="verifyEmail(email)">Resend Email</a></div>',
            title: title,
            subTitle: content,
            scope: $scope,
            buttons: [
                {text: 'Cancel'},
                {
                    text: '<b>Verify</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!$scope.data.ecode) {
                            //don't allow the user to close unless he enters the code
                            e.preventDefault();
                        } else {
                            ionLoading.show();
                            $http.get(localStorage.get('su') + "?type=verify_email_code&iMemberId=" + localStorage.get('memberid') + "&vCode=" + $scope.data.ecode)
                                .success(function (cResponse) {
                                    $scope.msg = cResponse[0].message;
                                    if (cResponse[0].action == 1) {
                                        $scope.emailVerificationIsSuccessfull = 1;
                                        console.log('verified');
                                        ionLoading.hide();
                                        $scope.successAlert('Success', $scope.msg);
                                    }
                                    else {
                                        $scope.emailVerificationIsSuccessfull = 0;
                                        ionLoading.hide();
                                        $scope.successAlert('Error', $scope.msg);
                                        console.log('not verified');
                                    }
                                });
                        }
                    }
                }
            ]
        });

        myPopup.then(function (res) {
            console.log('Code saved!', res);
        });

// $timeout(function() {
//    myPopup.close(); //close the popup after 3 seconds for some reason
// }, 3000);
    };

    $scope.successAlert = function (title, template) {
        var alertPopup = $ionicPopup.alert({
            title: title,
            template: template
        });

        alertPopup.then(function (res) {
            console.log(template);
        });

        $timeout(function () {
            alertPopup.close();
            $scope.onLoadMe();
        }, 5000);
    };
});
