appControllers.controller('ratingsCtrl', function ($scope, $mdToast, $mdDialog, localStorage, $http, ionLoading, $timeout, $state) {
    $scope.$on('$ionicView.enter', function () {
        $scope.nothingfound = false;
        $scope.nothingfoundingiven = false;
        $scope.onLoadMe();
        $scope.name = {
            'first': localStorage.get('fname'),
            'last': localStorage.get('lname'),
            'full': localStorage.get('fname') + ' ' + localStorage.get('lname')
        };
    });

    $scope.onLoadMe = function () {
        ionLoading.show();
        $scope.getUser();
        //console.log(localStorage.get('su')+'?type=rating_received&iMemberId='+localStorage.get('memberid'));
        $http.get(localStorage.get('su')+'?type=rating_received&iMemberId='+localStorage.get('memberid'))
            .success(function (response) {
                if(response[0].action == '1'){
                    $scope.count = response[0].message.length + ' rating(s) received.';
                    $scope.ratings = response[0].message;
                    ionLoading.hide();
                }
                else{
                    $scope.nothingfound = true;
                    ionLoading.hide();
                }
            });

        console.log(localStorage.get('su')+'?type=rating_given&iMemberId='+localStorage.get('memberid'));
        $http.get(localStorage.get('su')+'?type=rating_given&iMemberId='+localStorage.get('memberid'))
            .success(function (response) {
                if(response[0].action == '1'){
                    $scope.countGiven = response[0].message.length + ' rating(s) given.';
                    $scope.ratings_given = response[0].message;
                    ionLoading.hide();
                }
                else{
                    $scope.nothingfoundingiven = true;
                    ionLoading.hide();
                }
            });
    };

    $scope.getUser = function () {
        $http.get(localStorage.get('su') + '?type=personal_information&MemberId=' + localStorage.get('memberid') + '&lang_pref=EN')
            .success(function (response) {
                $scope.editProfile = {
                    'personal': response.personal_information,
                    'car': response.car_detail
                };
                $scope.irating = response.personal_information.rating;
                $scope.ratingmax = 5;
            });
    }
});