//Controller for all ride specific pages
appControllers.controller('rideCtrl', function ($scope, $state, $mdToast, $mdDialog, $http, localStorage, ionLoading, $ionicPopup, $timeout) {
    $scope.s = {};
    $scope.ratingmax = 5;
    $scope.noMoreItemsAvailable = true;
    $scope.availableRidesFound = true;
    $scope.pastRidesFound = true;
    var date = new Date();
    $scope.onezoneDatepicker = {
        date: date,
        /*calendarMode: true,*/
        disablePastDays: true,
        callback: function (value) {
            $scope.s.dateselected = value;
        }
    };

    $scope.search = function (s) {
        if (typeof s.from === 'undefined' || typeof s.to === 'undefined' || typeof s.dateselected === 'undefined') {
            $scope.errormessage = 'Please fill in all fields to search for a ride.'
        } else {
            ionLoading.show();
            var fromLat = s.from.geometry.location.lat();
            var fromLong = s.from.geometry.location.lng();
            var toLat = s.to.geometry.location.lat();
            var toLong = s.to.geometry.location.lng();
            var d = new Date(s.dateselected);
            var datenumb = d.getDate();
            var m = d.getMonth() + 1;
            var day = (datenumb < 10) ? '0' + datenumb : datenumb;
            var month = (m < 10) ? '0' + m : m;
            var year = d.getFullYear();
            var searchdate = day + '-' + month + '-' + year;

            var ToLatLong = '(' + toLat + ',' + toLong + ')';
            var FromLatLong = '(' + fromLat + ',' + fromLong + ')';
            $http.get(localStorage.get('su') + "?type=find_ride_count&To=" + ToLatLong + "&From=" + FromLatLong + "&searchdate=" + searchdate)
                .success(function (response) {
                    if (response[0].action == '1') {
                        $scope.found = '1';
                        $scope.showrides(FromLatLong, ToLatLong, searchdate);
                        $scope.searchCSS = true;
                        $scope.hidebutton = true;
                        $scope.nothingfound = '';
                        ionLoading.hide();
                    }
                    else {
                        $scope.nothingfound = '1';
                        $scope.searchCSS = false;
                        $scope.hidebutton = false;
                        ionLoading.hide();
                    }
                });
        }
    };

    $scope.showrides = function (f, t, d, p) {

        var limit = 10;
        var page = typeof p !== 'undefined' ? p : 1;
        //console.log(localStorage.get('su')+"?type=find_ride&lang_pref=EN&To="+t+"&From="+f+"&searchdate="+d+"&page=1&limit="+limit+"&curr=NGN");
        $http.get(localStorage.get('su') + "?type=find_ride&lang_pref=EN&To=" + t + "&From=" + f + "&searchdate=" + d + "&page=" + page + "&limit=" + limit + "&curr=NGN")
            .success(function (response) {
                //console.log(response);
                if (response.count_mainarr > 0) {
                    if (page == 1) {
                        $scope.foundrides = response.mainarr;
                        $scope.countfound = response.count_mainarr;
                        localStorage.set('searchCritaria', f + ':' + t + ':' + d);
                        localStorage.set('searchPageInit', page);
                        if (response.mainarr.length > 9) {
                            $scope.noMoreItemsAvailable = true;
                        }
                    } else {
                        $scope.foundrides.push(response.mainarr);
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        localStorage.set('searchPageInit', page);
                        if (response.mainarr.length > 9) {
                            $scope.noMoreItemsAvailable = true;
                        }
                    }
                }
            });
    };

    $scope.loadMoreData = function () {
        var args = localStorage.get('searchCritaria').split(':');
        var nextPage = localStorage.get('searchPageInit') + 1;
        $scope.showrides(args[0], args[1], args[2], nextPage);
    };

    $scope.showForm = function () {
        $scope.searchCSS = false;
        $scope.hidebutton = false;
    };

    $scope.viewride = function (iRideId, iRideDateId, start_iRidePointId, end_iRidePointId, ridereturn) {
        localStorage.set('t_iRideId', iRideId);
        localStorage.set('t_iRideDateId', iRideDateId);
        localStorage.set('t_start_iRidePointId', start_iRidePointId);
        localStorage.set('t_end_iRidePointId', end_iRidePointId);
        localStorage.set('return', ridereturn);
        $state.go('app.viewRide');
    };

    $scope.viewridedetails = function () {
        ionLoading.show();
        var t_iRideId = localStorage.get('t_iRideId');
        var t_iRideDateId = localStorage.get('t_iRideDateId');
        var t_start_iRidePointId = localStorage.get('t_start_iRidePointId');
        var t_end_iRidePointId = localStorage.get('t_end_iRidePointId');
        var rideURL = localStorage.get('su') + '?type=ride_detail&iRideId=' + t_iRideId + '&iRideDateId=' + t_iRideDateId + '&start_iRidePointId=' + t_start_iRidePointId + '&end_iRidePointId=' + t_end_iRidePointId + '&lang_pref=EN&curr=NGN&return=' + localStorage.get('return') + '&iMemberId=' + localStorage.get('memberid');
        console.log('check: ' + rideURL);
        $http.get(rideURL)
            .success(function (response) {
                if (response.action == 1) {
                    $scope.ridedetails = response.stack;
                    console.log(response);
                    $scope.rideUserDetails($scope.ridedetails.iMemberId);
                    ionLoading.hide();
                }
            });
    };

    $scope.rideUserDetails = function (uid) {
        console.log(localStorage.get('su') + '?type=personal_information&MemberId=' + uid + '&lang_pref=EN');
        $http.get(localStorage.get('su') + '?type=personal_information&MemberId=' + uid + '&lang_pref=EN')
            .success(function (response) {
                $scope.viewRideUserDetails = {
                    'personal': response.personal_information,
                    'car': response.car_detail
                };
                $scope.viewRideUserDetailsRating = response.personal_information.rating;
                $scope.viewRideUserDetailsRatingmax = 5;
                $scope.viewRideUserDetailRidePreferences = {
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
            });
    };

    $scope.getRidesOffered = function () {
        var availableRidesURL = localStorage.get('su') + "?type=my_rides&iMemberId=" + localStorage.get('memberid') + "&rtype=Available";
        var pastRidesURL = localStorage.get('su') + "?type=my_rides&iMemberId=" + localStorage.get('memberid') + "&rtype=Past";

        ionLoading.show();
        //get for available first
        $http.get(availableRidesURL)
            .success(function (response) {
                if (response[0].action == '1') {
                    $scope.availableRidesFound = true;
                    $scope.availableRides = response[0].message;
                }
                else {
                    $scope.availableRidesFound = false;
                }
            });

        $http.get(pastRidesURL)
            .success(function (response) {
                if (response[0].action == '1') {
                    $scope.pastRidesFound = true;
                    $scope.pastRides = response[0].message;
                }
                else {
                    $scope.pastRidesFound = false;
                }
            });

        ionLoading.hide();
    };

    $scope.deleteTrip = function (tid) {
        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: 'Are you sure you want to delete this trip? You cannot undo this action once done!',
            title: 'Delete Trip',
            subTitle: '',
            scope: $scope,
            buttons: [
                {text: 'Cancel'},
                {
                    text: '<b>Delete</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        ionLoading.show();
                        $http.get(localStorage.get('su') + "?&type=delete_trip&iMemberId="+localStorage.get('memberid')+"&iRideId="+tid)
                            .success(function (cResponse) {
                                $scope.msg = cResponse[0].message;
                                if (cResponse[0].success == 1) {
                                    $scope.getRidesOffered();
                                    ionLoading.hide();
                                    $scope.successAlert('Success', $scope.msg);
                                }
                                else {
                                    ionLoading.hide();
                                    $scope.successAlert('Error', $scope.msg);
                                    console.log('not deleted');
                                }
                            });
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
        }, 5000);
    };
});