appControllers.controller('bookingsCtrl', function ($scope, $mdToast, $mdDialog, localStorage, $http, ionLoading, $timeout, $state) {
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

});