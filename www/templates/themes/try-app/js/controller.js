appControllers.controller('tryappCtrl', function ($scope, localStorage) {
    $scope.walkthroughSeen = function () {
        localStorage.set('first-launch','1');
    }
});