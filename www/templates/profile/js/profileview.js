appControllers.controller('profileViewCtrl', function ($scope, $mdToast, $mdDialog, localStorage, $http, ionLoading, $timeout, $state) {
    $scope.$on('$ionicView.enter', function() {
        $scope.onLoadMe();
    });
    $scope.pimage = localStorage.get('pimage');
    $scope.name = {
        'first': localStorage.get('fname'),
        'last': localStorage.get('lname'),
        'full': localStorage.get('fname')+' '+localStorage.get('lname')
    };

    $scope.onLoadMe=function () {
        ionLoading.show();
        console.log(localStorage.get('su')+'?type=personal_information&MemberId='+localStorage.get('memberid')+'&lang_pref=EN');
        $http.get(localStorage.get('su')+'?type=personal_information&MemberId='+localStorage.get('memberid')+'&lang_pref=EN')
            .success(function(response){
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
                $scope.ridePreferences = {
                    'smoking':{
                        'icon':response.personal_information.Smoking,
                        'title':response.personal_information.Smoking_Lable
                    },
                    'music':{
                        'icon':response.personal_information.Music,
                        'title':response.personal_information.Music_Lable
                    },
                    'chattiness':{
                        'icon':response.personal_information.Chattiness,
                        'title':response.personal_information.Chattiness_Lable
                    },
                    'pets':{
                        'icon':response.personal_information.Pets,
                        'title':response.personal_information.Pets_Lable
                    }
                };
                ionLoading.hide();
            });
    };

    $scope.goto=function(l){
        $state.go(l)
    };
});