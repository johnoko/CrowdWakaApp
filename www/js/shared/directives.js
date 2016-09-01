//Directive numbersOnly :
//Use for change input to have ability accept only number.
//Example : <input ng-model="contract.age" numbers-only type="tel">
//
appControllers.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }

            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});// End Directive numbersOnly.

appControllers.directive('starRating', function () {
    return {
        restrict: 'A',
        template: '<ul class="rating">' +
        '<li ng-repeat="star in stars" ng-class="star">' +
        '\u2605' +
        '</li>' +
        '</ul>',
        scope: {
            ratingValue: '=',
            max: '='
        },
        link: function (scope, elem, attrs) {
            scope.stars = [];
            for (var i = 0; i < scope.max; i++) {
                scope.stars.push({
                    filled: i < scope.ratingValue
                });
            }
        }
    }
});


appServices.factory('localStorage', function ($filter, $window) {
    return {
        // Get data from localStorage it will use data key for getting the data.
        // Parameter :
        // key = reference of object in localStorage.
        get: function (key) {
            return $window.localStorage[key] || "null";
        },

        // Add data to localStorage it will use data key
        // by input data key and value for setting data to localStorage.
        // Parameter :
        // key = reference of object in localStorage.
        // value = data that will store in localStorage.
        set: function (key, value) {
            $window.localStorage[key] = value;
        },

        //Remove all data from localStorage.
        removeAll: function () {
            $window.localStorage.clear();
        },
        setObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key) {
            return JSON.parse($window.localStorage[key] || '{}');
        }
    };
});//End LocalStorage service.

appServices.factory('ionLoading', function($ionicLoading) {
//Loading indicator
    var loading = {
        opened: 0,
        show: function() {
            if (loading.opened > 0)
                return;
            $ionicLoading.show({
                noBackdrop :false,
                template: '<ion-spinner class="progress-circular"></ion-spinner>',
                duration :20000
            });
            loading.opened+=1;
        },
        hide: function() {
            loading.opened = 0;
            $ionicLoading.hide();
        }
    };
    return loading;
});

appServices.factory('Auth', function ($window) {
    return {
        isLoggedIn: function () {
            var _sik = $window.localStorage['sik'];
            return _sik ? true : false;
        },
        logout: function () {
            window.localStorage.removeItem("sik");
            window.localStorage.removeItem("list_dependents");
            _user = null;
        }
    }
});