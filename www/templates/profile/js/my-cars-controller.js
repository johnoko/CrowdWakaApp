appControllers.controller('carCtrl', function ($scope, $mdToast, $mdDialog, localStorage, $http, ionLoading, $timeout, $state, $ionicScrollDelegate) {
    $scope.$on('$ionicView.enter', function () {
        $scope.onLoadMyCars();
        //$scope.getCarMake();
        for(var i=1;i<10;i++)
        {
            $scope.seats = [1,2,3,4,5,6,7,8,9];
        }
    });

    $scope.onLoadMyCars = function () {
        //first get the car details
        ionLoading.show();
        $http.get(localStorage.get('su')+"?type=personal_information&MemberId="+localStorage.get('memberid')+"&lang_pref=EN")
            .success(function (response) {
                $scope.userdets = {
                    personal:response.personal_information,
                    cars:response.car_detail
                };
                ionLoading.hide();
            })
    };
    
    $scope.gotoaddride = function () {
        $state.go('app.addCar');
    };

    $scope.getCarMake = function () {
        $http.get(localStorage.get('su')+'?type=car_detail_dropdown_datas_make')
            .success(function (response) {
                $scope.makes = response.make;
            });

        console.log(localStorage.get('su')+'?type=car_detail_dropdown_datas&iMemberId='+localStorage.get('memberid'));
        $http.get(localStorage.get('su')+'?type=car_detail_dropdown_datas&iMemberId='+localStorage.get('memberid'))
            .success(function (response) {
                $scope.colors = response.color;
                $scope.types = response.type;
            })
    };

    $scope.getCarModel = function (makeid) {
        ionLoading.show();
        $http.get(localStorage.get('su')+'?type=car_detail_dropdown_datas_model&iMakeId='+makeid)
            .success(function (response) {
                $scope.makeselected = 1;
                $scope.models = response.model;
                ionLoading.hide();
            })
    };

    $scope.newcar = function (c) {
        ionLoading.show();
        var saveURL = localStorage.get('su')+'?type=car_add_edit&MemberId='+localStorage.get('memberid')+'&vPlateno='+c.platenumber+'&iMakeId='+c.carmake+'&iModelId='+c.model+'&eComfort='+c.comfortlevel+'&iSeats='+c.seats+'&iColourId='+c.color+'&iCarTypeId='+c.type;
        $http.get(saveURL)
            .success(function (response) {
                if(response[0].action == '1'){
                    ionLoading.hide();
                    $scope.showAlert(response[0].message);
                    $timeout(
                        function () {
                            $state.go('app.mycars');
                        },
                        5000 );
                } 
            });
    };

    $scope.showAlert = function ($content) {
        var alert = $mdDialog.alert({
            title: 'Message',
            content: $content,
            ok: 'Close'
        });
        $mdDialog
            .show( alert );
    };

    $scope.editCar = function (c) {
        var singleCarURL = localStorage.get('su')+'?type=car_add_edit&MemberId='+localStorage.get('memberid')+'&MemberCarId='+c.iMemberCarId+'&vPlateno='+c.vPlateno+'&iMakeId='+c.iMakeId+'&iModelId='+c.iModelId+'&eComfort='+c.eComfort+'&iSeats='+c.iSeats+'&iColourId='+c.iColourId+'&iCarTypeId='+c.iCarTypeId;
        ionLoading.show();
        $http.get(singleCarURL)
            .success(function (response) {
                if(response[0].action == '1'){
                    ionLoading.hide();
                    $scope.showAlert(response[0].message);
                    $timeout(
                        function () {
                            $scope.showcarform = false;
                            $ionicScrollDelegate.scrollTop();
                            $scope.onLoadMyCars();
                            $mdDialog.hide();
                        },
                        5000 );
                }
            });
    };

    $scope.showEditFrom = function (c) {
        $scope.onLoadMyCars();
        $scope.c = c;
        //console.log($scope.c);
        $scope.getCarModel(c.iMakeId);
        $scope.makeselected = true;
        $http.get(localStorage.get('su')+'?type=car_detail_dropdown_datas_make')
            .success(function (response) {
                $scope.makes = response.make;
            });

        $http.get(localStorage.get('su')+'?type=car_detail_dropdown_datas&iMemberId='+localStorage.get('memberid'))
            .success(function (response) {
                $scope.colors = response.color;
                $scope.types = response.type;
            });
        $scope.showcarform = true;
    };

    $scope.backtolist = function () {
        $scope.showcarform = false;
        $ionicScrollDelegate.scrollTop();
    };
});