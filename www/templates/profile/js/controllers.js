//Controller for all ride specific pages
appControllers.controller('profileCtrl', function ($scope, $mdToast, $mdDialog, localStorage, $http, ionLoading, $timeout, $state) {
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
                $scope.getCountries();
                $scope.getStates(response.personal_information.vCountryCode,false);
                $scope.getDatesYear();
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

    $scope.getCountries=function(){
        var countryUrl="?type=getCountry";
        $http.get(localStorage.get('su')+countryUrl)
            .success(function (response) {
                $scope.countries = response;
            });
    };

    $scope.getStates=function(c,s){
        var stateUrl;
        if(c != ''){
            stateUrl="?type=personal_dropdown_datas_state&vCountryCode="+c;
        }
        else{
            stateUrl="?type=personal_dropdown_datas_state&vCountryCode="+$scope.editProfile.personal.vCountryCode;
        }
        $http.get(localStorage.get('su')+stateUrl)
            .success(function (response) {
                $scope.cStates = response.state;
                if(s){
                    $scope.editProfile.personal.vStateCode = response.state[0].vStateCode;
                }
                //console.log(response);
            });
    };

    $scope.getDatesYear=function(){
        var years=[];
        var d = new Date();
        var n = d.getFullYear();
        for (var i = 1950; i <= (n - 17); i++) {
            years.push(i);
        }
        $scope.years = years;
    };

    $scope.editUserProfile=function(u){
        ionLoading.show();
        var profileData='?type=edit_profile&iMemberId='+u.iMemberId+'&vFirstName='+u.vFirstName+'&vLastName='+u.vLastName+'&eGender='+u.eGender+'&vNickName='+u.vNickName+'&vEmail='+u.vEmail+'&vPhone='+u.vPhone+'&vState='+u.vState+'&vCity='+u.vCity+'&vAddress='+u.vAddress+'&vZip='+u.vZip+'&iBirthYear='+u.iBirthYear+'&vLanguageCode=EN&tDescription='+u.tDescription+'&vBankAccountHolderName='+u.vBankAccountHolderName+'&vBankName='+u.vBankName+'&vAccountNumber='+u.vAccountNumber+'&vBankLocation='+u.vBankLocation+'&vBIC_SWIFT_Code='+u.vBIC_SWIFT_Code+'&vCountry='+u.vCountry+'&eMemberType='+u.eMemberType+'&mobileAlertchk=1&vPaymentEmail=';
        $http.get(localStorage.get('su')+profileData)
            .success(function (response){
                console.log(response);
                if(response[0].action=='1'){
                    $scope.message = response[0].msg;
                    $scope.showAlert(response[0].msg);
                    $timeout(
                        function () {
                            $scope.onLoadMe();
                            $state.go('app.profile');
                        },
                        5000
                    )
                }
                ionLoading.hide();
            });
    };
    
    $scope.changePassword=function(u){
        ionLoading.show();
       // console.log("MemberID: "+localStorage.get('memberid'));
       
       if(u.vNewPassword!=u.vNewPassword2)
       {
            $scope.showAlert("New password and Re-Enter Not Same");
             ionLoading.hide();
       }
       else
       {
       
            var profileData='?type=change_password&iMemberId='+localStorage.get('memberid')+'&OldPassword='+u.vOldPassword+'&Password='+u.vNewPassword;
            $http.get(localStorage.get('su')+profileData)
                .success(function (response){
                    //console.log(response[0].message);
                    if(response[0].success=='1'){
                        $scope.message = response[0].message;
                        $scope.showAlert(response[0].message);
                        $timeout(
                            function () {
                                $scope.onLoadMe();
                                $state.go('app.profile');
                            },
                            5000
                        )
                    }
                    else
                    {
                        $scope.showAlert(response[0].message);
                       /* $timeout(
                            function () {
                                $scope.onLoadMe();
                                $state.go('app.profile');
                            },
                            5000 ) */
                    }
                    ionLoading.hide();
                });
       }
    };
    
     $scope.showAlert = function ($content) {
        var alert = $mdDialog.alert({
            title: 'Message',
            content: $content,
            ok: 'Close'
        });
        $mdDialog
            .show( alert );
    }   
    
});