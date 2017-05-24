angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $ionicPopover, $timeout, $location, $ionicPopup) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    //--------------------------------------------
    $scope.login = function (user) {

        if (typeof (user) == 'undefined') {
            $scope.showAlert('Please fill username and password to proceed.');
            return false;
        }

        if (user.username == 'demo@gmail.com' && user.password == 'demo') {
            $location.path('/app/dashboard');
        } else {
            $scope.showAlert('Invalid username or password.');
        }

    };
    //--------------------------------------------
    $scope.logout = function () { $location.path('/app/login'); };
    //--------------------------------------------
    // An alert dialog
    $scope.showAlert = function (msg) {
        var alertPopup = $ionicPopup.alert({
            title: 'Warning Message',
            template: msg
        });
    };
    //--------------------------------------------
})

.controller('ProfilesCtrl', function ($scope, Profiles, $http) {
    //$scope.profiles = Profiles.all();

    //Get Current Date Records
    var today = new Date();
    var ToDate = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    var FromDate = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    var BFDate = "";
    var BTDate = "";

    $http.get("http://eisserver3/Mansha/naturals/BookingScheduler.asmx/GetBookingsSample", { params: { 'FromData': FromDate, 'ToDate': ToDate, 'BFDate': "", 'BTDate': "" } }).then(function (response) {
            if (response.data != "") {
                $scope.profiles = response.data;
            }
        })


    //Get Bookings By Date
    $scope.GetLanguages = function (FromData, ToDate) {
        $http.get("http://eisserver3/Mansha/naturals/BookingScheduler.asmx/GetBookingsSample", { params: { 'FromData': FromData, 'ToDate': ToDate, 'BFDate': "", 'BTDate': "" } }).then(function (response) {
            if (response.data != "") {
                $scope.profiles = response.data;
            }
        })
    }

    $scope.SearchClear = function () {
        $scope.FromData = '';
        $scope.ToDate = '';

    }

})

.controller('ProfileCtrl', function ($scope, $stateParams, Profiles, $http) {
    // $scope.profile = Profiles.get($stateParams.profileId);

    $scope.BookingDetails = [];
    $scope.BookingComboDetails = [];

    $http.get("http://124.123.33.8/Mansha/naturals/BookingScheduler.asmx/ViewEditSample", { params: { 'BookingId': $stateParams.profileId } }).then(function (response) {
        if (response.data != "") {
            $scope.profile = response.data;
            $scope.Name = $scope.profile.FirstName + " " + $scope.profile.LastName;
            $scope.BookingNo = $scope.profile.BookingNo;
            $scope.ContactNo = $scope.profile.ContactNo;
            $scope.Email = $scope.profile.Email;
            $scope.Address1 = $scope.profile.Address1;
            $scope.Address2 = $scope.profile.Address2;
            $scope.Address1 = $scope.profile.Amount;
            $scope.AppointmentDateTime = $scope.profile.AppointmentDateTime;
            $scope.Amount = $scope.profile.Amount;
            $scope.Code = $scope.profile.Code;
            $scope.PromoCodeValue = $scope.profile.PromoCodeValue;
            $scope.TaxValue = $scope.profile.TaxValue;
            $scope.TotalTime = $scope.profile.TotalTime;
            $scope.TotalValue = $scope.profile.TotalValue;
            $scope.PromoCodeDiscount = $scope.profile.PromoCodeDiscount;
            $scope.Status = $scope.profile.Status;
            $scope.City = $scope.profile.CityId;
            $scope.Area = $scope.profile.AreaId;
            $scope.RegisterLogin = $scope.profile.RegisterLoginID;
            $scope.BookingDetailsData = $scope.profile.BookingDetailsOne;
            $scope.RegisterLogin = $scope.profile.RegisterLoginID;
        }
    })
})

.controller('DashCtrl', function ($scope, $stateParams, Profiles, $http) {

    $scope.month = new Date().getMonth() + 1;
    $scope.year = new Date().getFullYear();

    $scope.CurrentDayWo = 0.00;
    $scope.CurrentWeekWo = 0.00;
    $scope.CurrentMonthWo = 0.00;

    $scope.TodaysEarnings = 0.00;
    $scope.WeekEarnings = 0.00;
    $scope.MonthEarnings = 0.00;

    $scope.InvoiceAmont = 0;
    $scope.PendingAmount = 0;
    
    $scope.checkArray = function (str) {
        for (var i = 0; i < str.length - 1; i++) {
            for (var j = 1; j < str.length; j++) {
                if (str[i] == str[j])
                    return false;
            }
        }
        return true;
    }

    $scope.changedates = function (month,year) {
        $scope.month = month;
        $scope.year = year;
        if ($scope.month == "" || $scope.month == "0" || $scope.month == undefined || $scope.month == null) {
            alert("Please select month.");
            return false;
        }
        if ($scope.year === "" || $scope.year === "0" || $scope.year === undefined || $scope.year === null) {
            alert("Please select year.");
            return false;
        }
        GetLineChar();
    }
    
    var GetLineChar = function () {
        /* Line dashboard chart */
        $http.get("http://124.123.33.8/Mansha/Common/LeftFormData.asmx/GetLineChartDataSample", { params: { 'month': $scope.month, 'year': $scope.year } }).success(function (data) {
            if (data != '' && typeof (data) == 'object') {
                $('#dvstackchart').html('');
                $('#dvBarChart').html('');
                $('#dvinvoicedetails').html('');
                $('#dvcustomerdetails').html('');
                $scope.Details = data;
                //  $scope.InvoiceData = data.InvoiceData;
                //for (var i = 0; i < data.details.length; i++) {

                //    data.details[i].Commission = data.details[i].Commission + "(" + data.details[i].Value + ")";
                //}
                data = data.details;
                $scope.CurrentDayWo = $scope.Details.CurrentWo == null ? 0.00 : $scope.Details.CurrentWo;
                $scope.CurrentWeekWo = $scope.Details.CurrentWeekWo == null ? 0.00 : $scope.Details.CurrentWeekWo;
                $scope.CurrentMonthWo = $scope.Details.CurrentMonthWo == null ? 0.00 : $scope.Details.CurrentMonthWo;

                $scope.TodaysEarnings = $scope.Details.TodaysEarnings == null ? 0.00 : $scope.Details.TodaysEarnings;
                $scope.WeekEarnings = $scope.Details.WeekEarnings == null ? 0.00 : $scope.Details.WeekEarnings;
                $scope.MonthEarnings = $scope.Details.MonthEarnings == null ? 0.00 : $scope.Details.MonthEarnings;

                $scope.PaidAmount = $scope.Details.PaidAmount == null ? 0.00 : $scope.Details.PaidAmount;
                $scope.PendingAmount = $scope.Details.PendingAmount == null ? 0.00 : $scope.Details.PendingAmount;
                $scope.InvoiceDetails = $scope.Details.InvoiceDetails;
                $scope.InvoicePieChartDetails = $scope.Details.InvoicePieChartDetails;
                var stackdata = [];
                var total = 0;
                var str = "";
                var Users = $scope.Details.Users;
                var st = "";
                for (var i = 0; i < Users.length; i++) {
                    st += Users[i].LoginName + ",";
                }
                st = st.substr(st, st.length - 1);
                var k = 0;
                for (var i = 0; i < $scope.InvoiceDetails.length; i++) {
                    stackdata.push({
                        'CreatedDates': $scope.InvoiceDetails[i].CreatedDates, 'LoginName1': '', 'CustomerCount1': '0', 'LoginName2': '', 'CustomerCount2': '0',
                        'LoginName3': '', 'CustomerCount3': '0', 'LoginName4': '', 'CustomerCount4': '0', 'LoginName5': '', 'CustomerCount5': '0', 'LoginName6': '', 'CustomerCount6': '0'
                    , 'LoginName7': '', 'CustomerCount7': '0', 'LoginName8': '', 'CustomerCount8': '0', 'LoginName9': '', 'CustomerCount9': '0', 'LoginName10': '', 'CustomerCount10': '0'
                        , 'LoginName11': '', 'CustomerCount11': '0', 'LoginName12': '', 'CustomerCount12': '0', 'LoginName13': '', 'CustomerCount13': '0', 'LoginName14': '', 'CustomerCount14': '0'
                        , 'LoginName15': '', 'CustomerCount15': '0', 'Total': '0'

                    })
                    total = 0;
                    var Log = $scope.InvoiceDetails[i].Log;
                    for (var j = 0; j < Log.length; j++) {
                        if (Log[j].LoginId != 0) {
                            stackdata[i]["LoginName" + (j + 1)] = Log[j].LoginName;
                            if ($scope.checkArray(str))
                                str[k] = Log[j].LoginName;
                            stackdata[i]["CustomerCount" + (j + 1)] = Log[j].Total;
                            total += parseFloat(Log[j].Total);
                        }
                    }
                    stackdata[i]["Total"] = total;
                }

                $.getScript('http://cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js', function () {
                    $.getScript('http://cdnjs.cloudflare.com/ajax/libs/morris.js/0.5.0/morris.min.js', function () {


                        Morris.Bar({
                            element: 'dvBarChart',
                            data: data,
                            xkey: 'CreatedDate',
                            ykeys: ['Commission', 'Value'],
                            parseTime: false,
                            labels: ['Bookings', 'Total'],
                            resize: true,
                        });


                        Morris.Donut({
                            element: 'dvinvoicedetails',
                            data: [
                    { label: "Scheduled", value: $scope.PaidAmount },
                    { label: "Unscheduled", value: $scope.PendingAmount }
                            ],

                            resize: false
                        });

                        Morris.Bar({
                            element: 'dvstackchart',
                            data: stackdata,

                            xkey: 'CreatedDates',
                            ykeys: ['Total'],
                            labels: ['Total', Users],
                            hideHover: 'auto',
                            fillOpacity: 0.6,
                            title: 'Total',
                            behaveLikeLine: true,
                            resize: true,
                            stacked: true,
                            hoverCallback: function (index, options, content) {
                                var finalContent = $(content);
                                var cpt = 0;
                                var con = "";
                                var total = 0;
                                var inputtext = "";
                                for (var i = 0; i < Object.keys(options.data[0]).length; i++) {
                                    if (options.data[index]["CustomerCount" + (i + 1)] != "0" && options.data[index]["CustomerCount" + (i + 1)] != undefined
                                        && options.data[index]["CustomerCount" + (i + 1)] != null && options.data[index]["CustomerCount" + (i + 1)] != "") {
                                        if (options.data[index]["CustomerCount" + (i + 1)] != "0") {
                                            if (options.data[index]["LoginName" + (i + 1)] != undefined) {
                                                inputtext += "\n" + options.data[index]["LoginName" + (i + 1)].trim() + ":" + options.data[index]["CustomerCount" + (i + 1)] + "<br/>";
                                                total += parseFloat(options.data[index]["CustomerCount" + (i + 1)]);
                                            }
                                        }
                                    }
                                    con = "<div class='morris-hover-row-label'>" + options.data[index]["CreatedDates"] + "</div><div class='morris-hover-point' style='color: #0b62a4'>"
                                   + "Total:" + total + "<br/>"
                               + inputtext
                             + "</div>"
                                }
                                return con;
                            }

                        });

                    });
                });
                switch ($scope.InvoicePieChartDetails.length) {
                    case 1:
                        Morris.Donut({
                            element: 'dvcustomerdetails',
                            data: [
                                { label: $scope.InvoicePieChartDetails[0].Name, value: $scope.InvoicePieChartDetails[0].Num },
                            ],
                            //colors: ['Green'],
                            resize: false
                        });
                        break;

                    case 2:
                        Morris.Donut({
                            element: 'dvcustomerdetails',
                            data: [
                                { label: $scope.InvoicePieChartDetails[0].Name, value: $scope.InvoicePieChartDetails[0].Num },
                                { label: $scope.InvoicePieChartDetails[1].Name, value: $scope.InvoicePieChartDetails[1].Num },
                            ],
                            //colors: ['Green', 'Orange'],
                            resize: false
                        });
                        break;
                    case 3:
                        Morris.Donut({
                            element: 'dvcustomerdetails',
                            data: [
                                { label: $scope.InvoicePieChartDetails[0].Name, value: $scope.InvoicePieChartDetails[0].Num },
                                { label: $scope.InvoicePieChartDetails[1].Name, value: $scope.InvoicePieChartDetails[1].Num },
                                { label: $scope.InvoicePieChartDetails[2].Name, value: $scope.InvoicePieChartDetails[2].Num },
                            ],
                            //colors: ['Green', 'Orange', 'Blue'],
                            resize: false
                        });
                        break;
                    case 4:
                        Morris.Donut({
                            element: 'dvcustomerdetails',
                            data: [
                                { label: $scope.InvoicePieChartDetails[0].Name, value: $scope.InvoicePieChartDetails[0].Num },
                                { label: $scope.InvoicePieChartDetails[1].Name, value: $scope.InvoicePieChartDetails[1].Num },
                                { label: $scope.InvoicePieChartDetails[2].Name, value: $scope.InvoicePieChartDetails[2].Num },
                                { label: $scope.InvoicePieChartDetails[3].Name, value: $scope.InvoicePieChartDetails[3].Num },
                            ],
                            //colors: ['Green', 'Orange', 'Blue', 'Red'],
                            resize: false
                        });
                        break;
                    case 5:
                        Morris.Donut({
                            element: 'dvcustomerdetails',
                            data: [
                                { label: $scope.InvoicePieChartDetails[0].Name, value: $scope.InvoicePieChartDetails[0].Num },
                                { label: $scope.InvoicePieChartDetails[1].Name, value: $scope.InvoicePieChartDetails[1].Num },
                                { label: $scope.InvoicePieChartDetails[2].Name, value: $scope.InvoicePieChartDetails[2].Num },
                                { label: $scope.InvoicePieChartDetails[3].Name, value: $scope.InvoicePieChartDetails[3].Num },
                                { label: $scope.InvoicePieChartDetails[4].Name, value: $scope.InvoicePieChartDetails[4].Num }
                            ],
                            //colors: ['Green', 'Orange', 'Blue', 'Red', 'Black'],
                            resize: false
                        });
                        break;

                    case 6:
                        Morris.Donut({
                            element: 'dvcustomerdetails',
                            data: [
                                { label: $scope.InvoicePieChartDetails[0].Name, value: $scope.InvoicePieChartDetails[0].Num },
                                { label: $scope.InvoicePieChartDetails[1].Name, value: $scope.InvoicePieChartDetails[1].Num },
                                { label: $scope.InvoicePieChartDetails[2].Name, value: $scope.InvoicePieChartDetails[2].Num },
                                { label: $scope.InvoicePieChartDetails[3].Name, value: $scope.InvoicePieChartDetails[3].Num },
                                { label: $scope.InvoicePieChartDetails[4].Name, value: $scope.InvoicePieChartDetails[4].Num },
                                { label: $scope.InvoicePieChartDetails[5].Name, value: $scope.InvoicePieChartDetails[5].Num }
                            ],
                            //colors: ['Green', 'Orange', 'Blue', 'Red', 'Black', 'Brown'],
                            resize: false
                        });
                        break;
                    case 7:
                        Morris.Donut({
                            element: 'dvcustomerdetails',
                            data: [
                                { label: $scope.InvoicePieChartDetails[0].Name, value: $scope.InvoicePieChartDetails[0].Num },
                                { label: $scope.InvoicePieChartDetails[1].Name, value: $scope.InvoicePieChartDetails[1].Num },
                                { label: $scope.InvoicePieChartDetails[2].Name, value: $scope.InvoicePieChartDetails[2].Num },
                                { label: $scope.InvoicePieChartDetails[3].Name, value: $scope.InvoicePieChartDetails[3].Num },
                                { label: $scope.InvoicePieChartDetails[4].Name, value: $scope.InvoicePieChartDetails[4].Num },
                                { label: $scope.InvoicePieChartDetails[5].Name, value: $scope.InvoicePieChartDetails[5].Num },
                                { label: $scope.InvoicePieChartDetails[6].Name, value: $scope.InvoicePieChartDetails[6].Num }
                            ],
                            //colors: ['Green', 'Orange', 'Blue', 'Red', 'Black', 'Brown', ''],
                            resize: false
                        });
                        break;
                    case 8:
                        Morris.Donut({
                            element: 'dvcustomerdetails',
                            data: [
                                { label: $scope.InvoicePieChartDetails[0].Name, value: $scope.InvoicePieChartDetails[0].Num },
                                { label: $scope.InvoicePieChartDetails[1].Name, value: $scope.InvoicePieChartDetails[1].Num },
                                { label: $scope.InvoicePieChartDetails[2].Name, value: $scope.InvoicePieChartDetails[2].Num },
                                { label: $scope.InvoicePieChartDetails[3].Name, value: $scope.InvoicePieChartDetails[3].Num },
                                { label: $scope.InvoicePieChartDetails[4].Name, value: $scope.InvoicePieChartDetails[4].Num },
                                { label: $scope.InvoicePieChartDetails[5].Name, value: $scope.InvoicePieChartDetails[5].Num },
                                { label: $scope.InvoicePieChartDetails[6].Name, value: $scope.InvoicePieChartDetails[6].Num },
                                { label: $scope.InvoicePieChartDetails[7].Name, value: $scope.InvoicePieChartDetails[7].Num }
                            ],
                            //colors: ['Green', 'Orange', 'Blue', 'Red', 'Black', 'Brown', '', ''],
                            resize: false
                        });
                        break;
                    case 9:
                        Morris.Donut({
                            element: 'dvcustomerdetails',
                            data: [
                                { label: $scope.InvoicePieChartDetails[0].Name, value: $scope.InvoicePieChartDetails[0].Num },
                                { label: $scope.InvoicePieChartDetails[1].Name, value: $scope.InvoicePieChartDetails[1].Num },
                                { label: $scope.InvoicePieChartDetails[2].Name, value: $scope.InvoicePieChartDetails[2].Num },
                                { label: $scope.InvoicePieChartDetails[3].Name, value: $scope.InvoicePieChartDetails[3].Num },
                                { label: $scope.InvoicePieChartDetails[4].Name, value: $scope.InvoicePieChartDetails[4].Num },
                                { label: $scope.InvoicePieChartDetails[5].Name, value: $scope.InvoicePieChartDetails[5].Num },
                                { label: $scope.InvoicePieChartDetails[6].Name, value: $scope.InvoicePieChartDetails[6].Num },
                                { label: $scope.InvoicePieChartDetails[7].Name, value: $scope.InvoicePieChartDetails[7].Num },
                                { label: $scope.InvoicePieChartDetails[8].Name, value: $scope.InvoicePieChartDetails[8].Num }
                            ],
                            //colors: ['Green', 'Orange', 'Blue', 'Red', 'Black', 'Brown', '', '', ''],
                            resize: false
                        });
                        break;
                    case 10:
                        Morris.Donut({
                            element: 'dvcustomerdetails',
                            data: [
                                { label: $scope.InvoicePieChartDetails[0].Name, value: $scope.InvoicePieChartDetails[0].Num },
                                { label: $scope.InvoicePieChartDetails[1].Name, value: $scope.InvoicePieChartDetails[1].Num },
                                { label: $scope.InvoicePieChartDetails[2].Name, value: $scope.InvoicePieChartDetails[2].Num },
                                { label: $scope.InvoicePieChartDetails[3].Name, value: $scope.InvoicePieChartDetails[3].Num },
                                { label: $scope.InvoicePieChartDetails[4].Name, value: $scope.InvoicePieChartDetails[4].Num },
                                { label: $scope.InvoicePieChartDetails[5].Name, value: $scope.InvoicePieChartDetails[5].Num },
                                { label: $scope.InvoicePieChartDetails[6].Name, value: $scope.InvoicePieChartDetails[6].Num },
                                { label: $scope.InvoicePieChartDetails[7].Name, value: $scope.InvoicePieChartDetails[7].Num },
                                { label: $scope.InvoicePieChartDetails[8].Name, value: $scope.InvoicePieChartDetails[8].Num },
                                { label: $scope.InvoicePieChartDetails[9].Name, value: $scope.InvoicePieChartDetails[9].Num }
                            ],
                            //colors: ['Green', 'Orange', 'Blue', 'Red', 'Black', 'Brown', '', '', '', ''],
                            resize: false
                        });
                        break;
                    default:

                }

            }
        }).error(function (e) {

        });

    };
    GetLineChar();

});

