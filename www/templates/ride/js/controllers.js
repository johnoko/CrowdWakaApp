//Controller for all ride specific pages
appControllers.controller('rideCtrl', function ($scope, $mdToast, $mdDialog) {
    $scope.s = {};
    var date = new Date();
    $scope.onezoneDatepicker = {
        date: date,
        /*calendarMode: true,*/
        disablePastDays: true,
        callback: function(value){
            $scope.s.dateselected = value;
        }
    };

    $scope.search = function (s) {
        console.log(s.from);
        if(typeof s.from === 'undefined' || typeof s.to === 'undefined' || typeof s.dateselected === 'undefined'){
            $scope.errormessage = 'Please fill in all fields to search for a ride.'
        }else{
            var fromLat = s.from.geometry.location.lat();
            var fromLong = s.from.geometry.location.lng();
            var toLong = s.to.geometry.location.lat();
            var toLong = s.to.geometry.location.lng();
        }
    };
});