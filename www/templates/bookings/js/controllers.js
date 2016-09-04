appControllers.controller('bookingsCtrl', function ($scope, $mdToast, $mdDialog, localStorage, $http, ionLoading, $timeout, $state, $ionicPopup) {
    $scope.$on('$ionicView.enter', function () {
        $scope.initBooking();
    });

    $scope.initBooking = function () {
        ionLoading.show();
        var asBooker = localStorage.get('su')+'?type=my_bookings&iMemberId='+localStorage.get('memberid')+'&Member=Booker&BookDate=All';
        var asDriver = localStorage.get('su')+'?type=my_bookings&iMemberId='+localStorage.get('memberid')+'&Member=Driver&BookDate=All';
        //start with booker
        $http.get(asBooker)
            .success(function (response) {
                if(response[0].success == 1){
                    $scope.bookersdetails = response[0].message;
                }
            });

        $http.get(asDriver)
            .success(function (response) {
                if(response[0].success == 1){
                    $scope.driversdetails = response[0].message;
                }
            });

        $http.get(localStorage.get('su')+'?type=personal_information&MemberId='+localStorage.get('memberid')+'&lang_pref=EN')
            .success(function (response) {
                $scope.personal_info = response.personal_information;
            });

        ionLoading.hide();
    };

    $scope.toggleBooking = function(id) {
        if ($scope.isBookingShown(id)) {
            $scope.shownBooking = null;
        } else {
            $scope.shownBooking = id;
        }
    };

    $scope.isBookingShown = function(id) {
        return $scope.shownBooking === id;
    };

    $scope.isPast = function (d, t) {
        var date = new Date();
        var date2 = new Date(d+" "+t);
        return (date2 >= date);
    };

    $scope.showConfirmationPopup = function (bid) {
        $scope.c = {};
        var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="c.vVerificationCode">',
            title: 'Confirm Ride Completion',
            subTitle: 'Enter the confirmation code you got from the passenger at the end of the ride.',
            scope: $scope,
            buttons: [
                {text: 'Cancel'},
                {
                    text: '<b>Confirm</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!$scope.c.vVerificationCode) {
                            //don't allow the user to close unless he enters the code
                            e.preventDefault();
                        } else {
                            ionLoading.show();
                            //console.log(localStorage.get('su') + "?type=validate_booking&iMemberId=" + localStorage.get('memberid') + "&iBookingId="+bid+"&vCode=" + $scope.c.vVerificationCode);
                            $http.get(localStorage.get('su') + "?type=validate_booking&iMemberId=" + localStorage.get('memberid') + "&iBookingId="+bid+"&vCode=" + $scope.c.vVerificationCode)
                                .success(function (response) {
                                    $scope.msg = response[0].message;
                                    if (response[0].action == 1) {
                                        console.log('verified');
                                        ionLoading.hide();
                                        $scope.successAlert('Success', $scope.msg);
                                    }
                                    else {
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

    $scope.showRatingPopupasDriver = function (booking_id,firstname,lastname,email,booker_id,driver_rating,ride_id) {
        $scope.r = {};
        $scope.rateCount = [1,2,3,4,5];
        var myPopup = $ionicPopup.show({
            template: '<md-checkbox ng-model="r.traveled" aria-label="Did not Travel" class="md-popup">Did not travel</md-checkbox><h5><strong>Rate the passenger experience.</strong></h5><md-radio-group class="inline-radio" ng-model="r.rate"><md-radio-button ng-repeat="rate in rateCount" value="{{rate}}"> {{rate}}</md-radio-button></md-radio-group><textarea ng-model="r.comment" class="bordered-textarea" placeholder="Enter some comments in the field below."></textarea>',
            title: 'Rate Passenger: '+firstname,
            subTitle: '',
            scope: $scope,
            buttons: [
                {text: 'Cancel'},
                {
                    text: '<b>Confirm</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!$scope.r.ratingwho || !$scope.r.rate || !$scope.r.comment) {
                            //don't allow the user to close unless he enters the code
                            e.preventDefault();
                        } else {
                            ionLoading.show();
                            if($scope.r.traveled){
                                $scope.r.ratingwho = 'Passenger';
                            }
                            else{
                                $scope.r.ratingwho = 'None';
                            }
                            //console.log(localStorage.get('su') + "?type=member_rating&iMemberFromId=" + localStorage.get('memberid') + "&vFirstName="+firstname+"&vLastName=" + lastname + "&vEmail=" +email+ "&iMemberToId=" +booker_id+ "&iBookingId="+booking_id+"&iRideId="+ride_id+"&tFeedback="+$scope.r.comment+"&eEvaluate=&eSkill=&iRate="+driver_rating+"&eWasRadio="+$scope.r.ratingwho+"&rating_number="+$scope.r.rate);
                            $http.get(localStorage.get('su') + "?type=member_rating&iMemberFromId=" + localStorage.get('memberid') + "&vFirstName="+firstname+"&vLastName=" + lastname + "&vEmail=" +email+ "&iMemberToId=" +booker_id+ "&iBookingId="+booking_id+"&iRideId="+ride_id+"&tFeedback="+$scope.r.comment+"&eEvaluate=&eSkill=&iRate="+driver_rating+"&eWasRadio="+$scope.r.ratingwho+"&rating_number="+$scope.r.rate)
                                .success(function (response) {
                                    $scope.msg = response[0].message;
                                    if (response[0].action == 1) {
                                        console.log('verified');
                                        ionLoading.hide();
                                        $scope.successAlert('Success', $scope.msg);
                                    }
                                    else {
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

    $scope.showRatingPopupasBooker = function (booking_id,firstname,lastname,email,driver_id,driver_rating,ride_id) {
        $scope.r = {};
        $scope.rateCount = [1,2,3,4,5];
        $scope.skills = {
            p: {name:'Pleasant',value:'Pleasant'},
            t: {name:'Can be better',value:'ToImprove'},
            a: {name:'Avoid',value:'Avoid'}
        };
        var myPopup = $ionicPopup.show({
            template: '<md-checkbox ng-model="r.traveled" aria-label="Did not Travel" class="md-popup">Did not travel</md-checkbox><h5><strong>Rate your experience.</strong></h5><md-radio-group class="inline-radio" ng-model="r.rate"><md-radio-button ng-repeat="rate in rateCount" value="{{rate}}"> {{rate}}</md-radio-button></md-radio-group><textarea ng-model="r.comment" class="bordered-textarea" placeholder="Enter some comments in the field below."></textarea><h5><strong>Evaluate Driving (anonymous)</strong></h5><md-radio-group ng-model="r.evalVal" class="notopmargin"><md-radio-button ng-repeat="s in skills" value="{{s.value}}"> {{s.name}}</md-radio-button></md-radio-group>',
            title: 'Rate Driver: '+firstname,
            subTitle: '',
            scope: $scope,
            buttons: [
                {text: 'Cancel'},
                {
                    text: '<b>Confirm</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!$scope.r.rate) {
                            //don't allow the user to close unless he enters the code
                            e.preventDefault();
                        } else {
                            ionLoading.show();
                            var evaluate;
                            if($scope.r.evalVal){
                                evaluate = "&eEvaluate=&eSkill="+$scope.r.evalVal;
                            }
                            else{
                                evaluate = "&eEvaluate=Yes&eSkill=";
                            }
                            if($scope.r.traveled){
                                $scope.r.ratingwho = 'Driver';
                            }
                            else{
                                $scope.r.ratingwho = 'None';
                            }
                            //console.log(localStorage.get('su') + "?type=member_rating&iMemberFromId=" + localStorage.get('memberid') + "&vFirstName="+firstname+"&vLastName=" + lastname + "&vEmail=" +email+ "&iMemberToId=" +driver_id+ "&iBookingId="+booking_id+"&iRideId="+ride_id+"&tFeedback="+$scope.r.comment+evaluate+"&iRate="+driver_rating+"&eWasRadio="+$scope.r.ratingwho+"&rating_number="+$scope.r.rate);
                            $http.get(localStorage.get('su') + "?type=member_rating&iMemberFromId=" + localStorage.get('memberid') + "&vFirstName="+firstname+"&vLastName=" + lastname + "&vEmail=" +email+ "&iMemberToId=" +driver_id+ "&iBookingId="+booking_id+"&iRideId="+ride_id+"&tFeedback="+$scope.r.comment+evaluate+"&iRate="+driver_rating+"&eWasRadio="+$scope.r.ratingwho+"&rating_number="+$scope.r.rate)
                                .success(function (response) {
                                    $scope.msg = response[0].message;
                                    if (response[0].action == 1) {
                                        console.log('verified');
                                        ionLoading.hide();
                                        $scope.successAlert('Success', $scope.msg);
                                    }
                                    else {
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
            $scope.initBooking();
        }, 5000);
    };

});