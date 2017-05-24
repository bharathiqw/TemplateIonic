var mainApp = angular.module("NaturalHomesApp", []);
mainApp.controller('NaturalHomeController', function ($scope, $http, $compile) {
    $("#imgloader").css("display", "block");
    if (localStorage.getItem("ComboPackId") != undefined) {
        $scope.ComboPackId = parseInt(localStorage.getItem("ComboPackId"));
    }
    $scope.GetCities = function () {
        $scope.Cities = [];
        //var params = { 'screenCode': $scope.screenCode, 'Id': Id };
        var url = "Default.asmx/GetCities";
        $http.get(url).success(function (data) {
            if (data != "") {
                var d = JSON.parse(data);
                $scope.Cities = JSON.parse(d);
                if ($scope.Cities.length != 0) {
                    $scope.Firstcity = $scope.Cities[0].Name;
                    $scope.SelectedIndex = 0;
                }
                else {
                    $scope.Firstcity = "";
                    $scope.SelectedIndex = -1;
                }
                $scope.GetServices();
            }
        });
    }
    $scope.RedirectServiceCat = function () {
        location.href = "ServiceCategories.aspx";
    }
    $scope.RedirectToHome = function () {
        location.href = "Default.aspx";
    }
    $scope.SelectCity = function (index) {
        //if (localStorage["Cart"] != undefined && localStorage["Cart"] != "null" && localStorage["Cart"] != null) {
        //    $scope.AlertMsg = "Please Empty Cart to change city.";
        //    return false;
        //}
        $scope.AlertMsg = "";
        $scope.SelectedIndex = index;
        $scope.SelectedName = $scope.Cities[index].Name;
        $scope.Firstcity = $scope.Cities[index].Name;
    }
    $scope.GetCities();
    $scope.GetServices = function () {
        var CityId = 0;
        CityId = $scope.Cities[$scope.SelectedIndex].CityId;
        //var ServiceId;
        //if (ServiceId1 == undefined)
        //    ServiceId = 0;
        var url = "Default.asmx/GetcomboData";
        $("#imgloader").css("display", "block");
        // $("#imgloader").css("display", "block");
        var params = { 'CityId': CityId }
        $http.get(url, { params: params }).success(function (data) {
            var d = JSON.parse(data);

            $scope.Categories = JSON.parse(d);
            if ($scope.Categories.length > 0) {
                var myEl = angular.element(document.querySelector('#combodiv'));
                var ele = "";
                for (var i = 0; i < $scope.Categories.length; i++) {

                    var str = GetString(i);
                    //var ele = angular.element($event.target).parent();
                    //if (i != 0) {
                    //    ele += '<div class="panel-heading">'
                    //     + ' <h4 class="panel-title">'
                    //     + ' <a id="anc' + (i) + '" class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#' + str + '" ng-click="GetRateCard(' + $scope.Categories[i].ComboPackId + ',' + 0 + ')">'
                    //     + '<span class="glyphicon  pull-right"></span>'
                    //     + $scope.Categories[i].Name
                    //     + ' </a>'
                    //     + '  </h4>'
                    //     + ' </div>'
                    //     + ' <div id=' + str + ' class="panel-collapse collapse in"  >'
                    //     + '  <div class="panel-body">'
                    //     + '<ul class="service-list" id="subcat' + i + '">'
                    //     + '</ul>'
                    //     + '</div>'
                    //     + ' </div>'

                    //}
                    //else {
                    //    ele += '<div class="panel-heading panel-heading-active">'
                    //    + ' <h4 class="panel-title">'
                    //    + ' <a id="anc' + (i) + '" class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#' + str + '" ng-click="GetRateCard(' + $scope.Categories[i].ComboPackId + ',' + 0 + ')">'
                    //    + '<span class="glyphicon  pull-right"></span>'
                    //    + $scope.Categories[i].Name
                    //    + ' </a>'
                    //    + '  </h4>'
                    //    + ' </div>'
                    //    + ' <div id=' + str + ' class="panel-collapse collapse in"  >'
                    //    + '  <div class="panel-body">'
                    //    + '<ul class="service-list" id="subcat' + i + '">'
                    //    + '</ul>'
                    //    + '</div>'
                    //    + ' </div>'
                    //    // );
                    //}
                    ele += '<li id="ac' + i + '" style="cursor:pointer;"><a  ng-click="GetRateCard(' + $scope.Categories[i].ComboPackId + ',' + i + ')"><img  src="img/ComboPackPic/' + $scope.Categories[i].Image + '"/>'
                               + ' <span class="service-subctgry-name">'
                        + $scope.Categories[i].Name
                                        + '</span></a></li>'
                    // );


                }
                var temp = $compile(ele)($scope);
                angular.element(document.getElementById('combodiv')).append(temp);
                //for (var i = 0; i < $scope.Categories.length; i++) {
                //    var SubCategory = $scope.Categories[i].SubCategory;
                //    if (SubCategory.length != 0) {
                //        var el = "";
                //        for (var j = 0; j < SubCategory.length; j++) {
                //            el += '<li><a style="cursor:pointer;" ng-click="GetRateCard(' + $scope.Categories[i].ComboPackId + ',' + SubCategory[j].SubCategoryId + ')"><img style="width:90px;height:60px;" src="img/ComboPackPic/' + SubCategory[j].Image + '"/>'
                //                    + SubCategory[j].Name
                //                    + '</a></li>'
                //            // );
                //        }
                //        var temp1 = $compile(el)($scope);
                //        angular.element(document.getElementById("subcat" + i)).append(temp1);
                //    }

                //}
                //CheckStatus();
                if ($scope.ComboPackId != undefined && $scope.ComboPackId != "null") {
                    for (var i = 0; i < $scope.Categories.length; i++) {
                        if ($scope.Categories[i].ComboPackId == $scope.ComboPackId) {
                            $scope.ActiveIndex = i;
                            var id = $scope.ComboPackId;
                            $scope.ComboName = $scope.Categories[i].Name;
                            $scope.GetRateCard(id, i);
                            // localStorage.setItem("SubCategoryId", null);
                        }
                    }
                }
                else
                    $scope.GetRateCard($scope.Categories[0].ComboPackId, 0);
            }
        },
        Error(function (result) {
            $("#imgloader").css("display", "none");
        }));
    }
    $scope.ChangeColor = function () {
        for (var i = 0; i < $scope.Categories.length; i++) {

            $("#ac" + i).css("background-color", "white");
            $("#ac" + i).css("color", "#2b2a2b");

        }
    }
    $scope.Changesign = function (i, str) {
        //var k = 0;
        //for (var j = 0; j < $scope.Categories.length; j++) {

        //    var str = GetString(j);
        //    if (i != j) {
        //        if ($('#' + str).hasClass("collapse in")) {
        //            $("#" + str).removeClass("collapse in").addClass("collapse");
        //            $("#anc" + j).children().removeClass("glyphicon-minus").addClass("glyphicon-plus");
        //        }
        //    }
        //}
        //var str = GetString(i);
        //if ($("#anc" + i).children().hasClass("glyphicon-plus")) {
        //    $("#anc" + i).children().removeClass("glyphicon-plus").addClass("glyphicon-minus");

        //}
        //else if ($("#anc" + i).children().hasClass("glyphicon-minus")) {
        //    $("#anc" + i).children().removeClass("glyphicon-minus").addClass("glyphicon-plus");

        //}
        $('.panel-heading').click(function () {
            if ($('.panel-heading').hasClass('panel-heading-active')) {
                $('.panel-heading').removeClass('panel-heading-active');
                $(this).addClass("panel-heading-active");

            }

        });

    }
    CheckStatus = function (i) {
        // alert("hi");
        $('.collapse').on('shown.bs.collapse', function () {
            $(this).parent().find(".glyphicon-plus").removeClass("glyphicon-plus").addClass("glyphicon-minus");
        })
			.on('hidden.bs.collapse', function () {
			    $(this).parent().find(".glyphicon-minus").removeClass("glyphicon-minus").addClass("glyphicon-plus");
			});

        $('.accordion-toggle').each(function () {
            if ($(this).children().hasClass('glyphicon-minus')) {
                $(this).parent().parent().addClass("panel-heading-active");
            }
        });

        $('.panel-heading').click(function () {
            if ($('.panel-heading').hasClass('panel-heading-active')) {
                $('.panel-heading').removeClass('panel-heading-active');
                $(this).addClass("panel-heading-active");
            }
        });

        $(".add-to-cart").click(function () {
            $(".rate-card").addClass('selected-service-visible')
            $(".selected-services").show();
            $(this).parent().parent().addClass('selected-srvc');
            $(this).children().removeClass('fa-cart-plus').addClass('fa-check');
        });
    }
    GetString = function (i) {
        switch (i + 1) {
            case 1: return "collapseOne";
                break;
            case 2: return "collapseTwo";
                break;
            case 3: return "collapseThree";
                break;
            case 4: return "collapseFour";
                break;
            case 5: return "collapseFive";
                break;
            case 6: return "collapseSix";
                break;
            case 7: return "collapseSeven";
                break;
            case 8: return "collapseEight";
                break;
            case 9: return "collapseNine";
                break;
            case 10: return "collapseTen";
                break;
            case 11: return "collapseEleven";
                break;
            case 12: return "collapseTwelve";
                break;
            case 13: return "collapseThirteen";
                break;
            case 14: return "collapseFourteen";
                break;
            case 15: return "collapseFifteen";
                break;
            case 16: return "collapseSixteen";
                break;
            case 17: return "collapseSeventeen";
                break;
            case 18: return "collapseEighteen";
                break;
            case 19: return "collapseNineteen";
                break;
            case 20: return "collapseTwenty";
                break;
            case 21: return "collapseTwentyone";
                break;
            case 22: return "collapseTwentytwo";
                break;
            case 23: return "collapseTwentythree";
                break;
            case 24: return "collapseTwentyfour";
                break;
            case 25: return "collapseTwentyfive";
                break;
            case 27: return "collapseTwentyseven";
                break;
            case 28: return "collapseTwentyeight";
                break;
            case 29: return "collapseTwentynine";
                break;
            case 30: return "collapseThirty";
                break;
            case 31: return "collapseThirtyone";
                break;
            case 32: return "collapseThirtytwo";
                break;
            case 33: return "collapseThirtythree";
                break;
            case 34: return "collapseThirtyfour";
                break;
        }
    }

    // $scope.Cart = [];
    if (localStorage["Cart"] == "null" || localStorage["Cart"] == undefined) {
        $scope.Cart = [];
        $scope.ShopCount = 0;
    }
    else {
        $scope.Cart = JSON.parse(localStorage["Cart"]);
        $scope.ShopCount = $scope.Cart.length;
    }
    $scope.GetRateCard = function (CategoryId, i) {
        $("#imgloader").css("display", "block");
        $scope.acRemove = false;
        $scope.ComboName = $scope.Categories[i].Name;
        $scope.Changesign();
        if (CategoryId == undefined) {

            CategoryId = 0;
        }
        $scope.ChangeColor();
        $("#ac" + i).css("background-color", "#e4c121");
        $("#ac" + i).css("color", "#fff");
        $("#spn0").removeClass("fa-check").addClass("fa-cart-plus")
        var params = { 'ComboPackId': CategoryId, 'CityId': $scope.Cities[$scope.SelectedIndex].CityId };
        var url = "Default.asmx/GetcomboRateCard";
        $http.get(url, { params: params }).success(function (data) {
            $("#tbody").empty();

            //$("#imgloader").css("display", "none");
            var RateCard = JSON.parse(data);
            RateCard = JSON.parse(RateCard);
            if (typeof (RateCard) == "object") {
                if (RateCard.length > 0) {
                    $scope.RateCard = RateCard;
                    var ele = "";
                    $scope.selectedrows = 0;
                    var duration = 0;
                    for (var i = 0; i < $scope.RateCard.length; i++)
                        duration += parseFloat($scope.RateCard[i].Duration);
                    $scope.RateCard[0].ComboPackDuration = duration;
                    $scope.RateCard[0].ComboPackDuration1 = duration;
                    ele += '<tr><td data-title="Name">' + $scope.RateCard[0].ComboPackName + '</td>'
                        + '<td data-title="Quantity"><a style="cursor: pointer; font-weight: bold;" ng-click="ChangeQuantityMinus(' + 0 + ')"><</a>&nbsp;'
                            + $scope.RateCard[0].ComboPackQuantity
                            + '&nbsp;<a style="cursor: pointer; font-weight: bold;" ng-click="ChangeQuantityPlus(' + 0 + ')">></a></td>'
                        //+ '<td data-title="Duration">' + $scope.RateCard[0].ComboPackDuration + 'min</td>'
                       + '<td data-title="Price" ><span class="fa fa-usd"></span>' + $scope.RateCard[0].ComboPackPrice + '</td>'
                       + '<td data-title="Amount"><span class="fa fa-usd"></span>' + $scope.RateCard[0].ComboPackAmount + '</td>'
                       + "<td data-title='Add(OR)Remove'><a class='btn btn-sm  btn-primary add-to-cart' ng-click='SelectService( )'><span class='fa fa-cart-plus'  id='spn0'></span>Add to cart</a>"
                       + '&nbsp;&nbsp;<a ng-show="acRemove" class="btn-remove" style="cursor: pointer;" ng-click="RemoveRate()"><i class="fa fa-times-circle"></i></a>'
                       + "</td>"
                        + "</tr>"
                    + "<tr><td style='color: purple;font-weight: bold;'>Services</td><td></td><td></td><td></td><td></td><td></td></tr>";
                    for (var i = 0; i < $scope.RateCard.length; i++) {
                        ele += "<tr id='tr'" + i + ">"
                        + "<td>" + $scope.RateCard[i].Name + "</td>"
                         + "<td></td>"
                        //  + '<td><a style="cursor: pointer; font-weight: bold;" ng-click="ChangeQuantityMinus(' + i + ')">-</a>&nbsp;'
                         //   + $scope.RateCard[i].Quantity
                        //    + '&nbsp;<a style="cursor: pointer; font-weight: bold;" ng-click="ChangeQuantityPlus(' + i + ')">+</a></td>'
                        //+ "<td>" + $scope.RateCard[i].Duration + "min</td>"
                        + "<td><span class='fa fa-usd'></span>" + $scope.RateCard[i].Price + "</td>"

                        + "<td></td><td></td>"
                        + "</tr>";
                        // + "<td><span class='fa fa-usd'></span>" + $scope.RateCard[i].Amount + "</td>"
                        // + "<td><a class='btn btn-sm btn-primary add-to-cart' ng-click='SelectService(" + i + "," + $scope.RateCard[i].ServiceId + ")'><span class='fa fa-cart-plus' id='spn" + i + "'></span>Add to cart</a></td>"

                    }
                    var temp = $compile(ele)($scope);
                    angular.element(document.getElementById('tbody')).append(temp);
                    $scope.CheckExistingServices();
                    $("#cardbody").empty();
                    $("#selectedservices").css("display", "none");

                    $scope.TotalTime = 0;
                    $scope.TotalAmount = 0;
                    $("#imgloader").css("display", "none");
                }
            }

        },
        Error(function (result) {
            $("#imgloader").css("display", "none");
        }));
    }
    $scope.CheckExistingServices = function () {
        var duration = 0;
        for (var i = 0; i < $scope.RateCard.length; i++) {
            for (var j = 0; j < $scope.Cart.length; j++) {
                if ($scope.RateCard[i].ComboPackId == $scope.Cart[j].ComboPackId) {
                    $scope.RateCard[i].ComboDuration = $scope.Cart[j].Duration;
                    $scope.RateCard[i].ComboPackQuantity = $scope.Cart[j].Quantity;
                    $scope.RateCard[i].ComboPackAmount = $scope.Cart[j].Amount;
                    duration = $scope.Cart[j].Duration;
                    $("#spn0").removeClass("fa-cart-plus").addClass("fa-check");
                    $scope.acRemove = true;
                }
            }
        }
        var ele = "";
        $("#tbody").empty();
        $scope.selectedrows = 0;
        //
        //for (var i = 0; i < $scope.RateCard.length; i++)
        //    duration += parseFloat($scope.RateCard[i].Duration);
        //$scope.RateCard[0].ComboPackDuration = duration;
        ele += '<tr><td data-title="Name">' + $scope.RateCard[0].ComboPackName + '</td>'
                       + '<td data-title="Quantity"><a style="cursor: pointer; font-weight: bold;" ng-click="ChangeQuantityMinus(' + 0 + ')"><</a>&nbsp;'
                           + $scope.RateCard[0].ComboPackQuantity
                           + '&nbsp;<a style="cursor: pointer; font-weight: bold;" ng-click="ChangeQuantityPlus(' + 0 + ')">></a></td>'
                       //+ '<td data-title="Duration">' + $scope.RateCard[0].ComboPackDuration + 'min</td>'
                      + '<td data-title="Price"><span class="fa fa-usd"></span>' + $scope.RateCard[0].ComboPackPrice + '</td>'
                      + '<td data-title="Amount"><span class="fa fa-usd"></span>' + $scope.RateCard[0].ComboPackAmount + '</td>'
                      + "<td ><a id='actcart' class='btn btn-sm  btn-primary add-to-cart' ng-click='SelectService( )'><span class='fa fa-cart-plus'  id='spn0'></span>Add</a>"
                       + '&nbsp;&nbsp;<a ng-show="acRemove" class="btn-remove" style="cursor: pointer;" ng-click="RemoveRate()"><i class="fa fa-times-circle"></i></a>'
                       + "</td>"//<a class='btn btn-sm btn-primary add-to-cart' ng-click='SelectService(" + 0 + "," + $scope.RateCard[0].ComboPackId + ")'><span class='fa fa-cart-plus' id='spn0'></span>Add to cart</a></td>"
                       + "</tr>"
                   + "<tr><td style='color: purple;font-weight: bold;'>Services</td><td></td><td></td><td></td><td></td><td></td></tr>";

        for (var i = 0; i < $scope.RateCard.length; i++) {
            ele += "<tr id='tr'" + i + ">"
            + "<td>" + $scope.RateCard[i].Name + "</td>"
             + "<td></td>"
            //  + '<td><a style="cursor: pointer; font-weight: bold;" ng-click="ChangeQuantityMinus(' + i + ')">-</a>&nbsp;'
             //   + $scope.RateCard[i].Quantity
            //    + '&nbsp;<a style="cursor: pointer; font-weight: bold;" ng-click="ChangeQuantityPlus(' + i + ')">+</a></td>'
            //+ "<td>" + $scope.RateCard[i].Duration + "min</td>"
            + "<td><span class='fa fa-usd'></span>" + $scope.RateCard[i].Price + "</td>"

            + "<td></td><td></td>"
            + "</tr>";
            // + "<td><span class='fa fa-usd'></span>" + $scope.RateCard[i].Amount + "</td>"
            // + "<td><a class='btn btn-sm btn-primary add-to-cart' ng-click='SelectService(" + i + "," + $scope.RateCard[i].ServiceId + ")'><span class='fa fa-cart-plus' id='spn" + i + "'></span>Add to cart</a></td>"

        }
        var temp = $compile(ele)($scope);
        angular.element(document.getElementById('tbody')).append(temp);
        for (var i = 0; i < $scope.RateCard.length; i++) {
            for (var j = 0; j < $scope.Cart.length; j++) {
                if ($scope.RateCard[i].ComboPackId == $scope.Cart[j].ComboPackId) {
                    var cache = $('#actcart').children();
                    $("#actcart").text("Added").prepend(cache);
                    $("#spn0").removeClass("fa-cart-plus").addClass("fa-check");
                    $scope.acRemove = true;
                }
            }
        }
    }

    CheckStatus1 = function (i) {
        alert(i);
    }
    $scope.RemoveRate = function (i, index) {
        var cambopackid
        if ($scope.Cart.length > 0) {
            cambopackid = $scope.RateCard[0].ComboPackId;
        }
        for (var i = 0; i < $scope.Cart.length; i++) {
            if ($scope.Cart[i].Type == "Combo") {
                if ($scope.Cart[i].ComboPackId == cambopackid) {
                    $scope.Cart.splice(i, 1);
                    $scope.ShopCount = $scope.Cart.length;
                    localStorage["Cart"] = JSON.stringify($scope.Cart);
                    //$scope.RateCard = [];
                    //$("#tbody").empty();
                    $scope.RateCard[0].ComboPackDuration = $scope.RateCard[0].ComboPackDuration1;
                    $scope.RateCard[0].ComboPackQuantity =1;
                    $scope.RateCard[0].ComboPackAmount = $scope.RateCard[0].ComboPackPrice;
                    $("#spn0").removeClass("fa-check ").addClass("fa-cart-plus");
                    var cache = $('#actcart').children();
                    $("#actcart").text("Add").prepend(cache);
                    $("#actcart").removeClass("btn-primary-pink").addClass("btn-primary");
                    $scope.acRemove = false;
                }
            }
        }
        $scope.CheckExistingServices();
    }
    $scope.SelectService = function (i, Id) {
        try {
            for (var i = 0; i < $scope.RateCard.length; i++) {
                if ($("#spn0").hasClass("fa-cart-plus")) {
                    var cache = $('#actcart').children();
                    $("#actcart").text("Added").prepend(cache);
                    $("#spn0").removeClass("fa-cart-plus").addClass("fa-check");
                    $("#actcart").removeClass("btn-primary").addClass("btn-primary-pink");
                    $scope.acRemove = true;
                    var check = true;
                    $scope.Cart.push({
                        'Name': $scope.RateCard[i].ComboPackName, 'Quantity': $scope.RateCard[i].ComboPackQuantity, 'Duration': $scope.RateCard[i].ComboPackDuration
                        , 'Price': $scope.RateCard[i].ComboPackPrice, 'Amount': $scope.RateCard[i].ComboPackAmount, 'ComboPackId': $scope.RateCard[i].ComboPackId, 'Type': 'Combo'
                    });
                    //if ($scope.Cart.length == 0) {
                    //    $scope.Cart.push({
                    //        'ServiceId': $scope.RateCard[i].ServiceId, 'Name': $scope.RateCard[i].Name, 'Duration': $scope.RateCard[i].Duration
                    //   , 'Price': $scope.RateCard[i].Price, 'Quantity': $scope.RateCard[i].Quantity, 'Amount': $scope.RateCard[i].Amount,
                    //   'ComboPackId': $scope.RateCard[i].ComboPackId,'Type':'Combo'
                    //    });
                    //}
                    //else {
                    //    for (var j = 0; j < $scope.Cart.length; j++) {
                    //        if ($scope.RateCard[i].ServiceId == $scope.Cart[j].ServiceId) {
                    //            check = false;
                    //            break;
                    //        }
                    //    }
                    //    if (check) {
                    //        $scope.Cart.push({
                    //            'ServiceId': $scope.RateCard[i].ServiceId, 'Name': $scope.RateCard[i].Name, 'Duration': $scope.RateCard[i].Duration
                    //        , 'Price': $scope.RateCard[i].Price, 'Quantity': $scope.RateCard[i].Quantity, 'Amount': $scope.RateCard[i].Amount
                    //            ,'ComboPackId': $scope.RateCard[i].ComboPackId,'Type':'Combo'
                    //        });
                    //    }
                    //}

                }
            }
            $scope.ShopCount = $scope.Cart.length;
            localStorage["Cart"] = JSON.stringify($scope.Cart);
        } catch (e) {

        }
    }
    $scope.SelectService1 = function (i, id) {

        if ($("#spn" + i).hasClass("fa-cart-plus")) {
            $("#spn" + i).removeClass("fa-cart-plus").addClass("fa-check");
            $("#selectedservices").css("display", "block");
            $("#ratecard").addClass("selected-service-visible");
            var eles = "";
            eles += "<tr id=trcard" + i + ">"
           + "<td data-th='Product'>"
           + '<h4 class="margin-zero">' + $scope.RateCard[i].Name + '</h4>'
           + '<span class="time">' + $scope.RateCard[i].Duration + '</span>'
           + '</td>'
           + '<td data-th="Price" class="price" colspan="2">'
           + '<span class="price-service">'
           + '<span class="fa fa-usd"></span>' + $scope.RateCard[i].Price
           + '</span>'
           + '<a class="btn-remove"><i class="fa fa-times-circle"></i></a>'
         //  + ' <a class="btn-remove  pull-right" style="cursor:pointer;" ng-click="RemoveRate(' + i + ',' + $scope.selectedrows + ')><i class="fa fa-times-circle"></i></a>'
         //  + '<img class="btn-remove fa fa-times-circle" ></img>'
           + '</td>'
           + '</tr>';
            var temp = $compile(eles)($scope);
            angular.element(document.getElementById('cardbody')).append(temp);
            $scope.TotalAmount += parseFloat($scope.RateCard[i].Price);
            $scope.TotalTime += parseFloat($scope.RateCard[i].Duration);
            $scope.selectedrows++;
        }
        //else if ($("#spn" + i).hasClass("fa-check")) {
        //    $("#spn" + i).removeClass("fa-check").addClass("fa-cart-plus");
        //    $('table#cart tr#trcard' + i + '').remove();
        //    $scope.TotalAmount -= parseFloat($scope.RateCard[i].Price);
        //    $scope.TotalTime -= parseFloat($scope.RateCard[i].Duration);
        //    var count = $("#myTable > tbody > tr").length;
        //    if (count == 0)
        //    {
        //        $("#selectedservices").css("display", "none");
        //        $("#ratecard").removeClass("selected-service-visible");
        //    }
        //}

    }
    $scope.ChangeQuantityMinus = function (index) {
        var Quantity = parseInt($scope.RateCard[index].ComboPackQuantity);
        Quantity--;
        if (Quantity <= 0) {
            alert("Quantity Cannot be negative.");
            $scope.RateCard[index].ComboPackQuantity = 1;
            $scope.RateCard[index].ComboPackDuration = $scope.RateCard[index].ComboPackDuration1;
            $scope.RateCard[index].ComboPackAmount = $scope.RateCard[index].ComboPackPrice;
            return false;
        }
        $("#tbody").empty();
        for (var l = 0; l < $scope.RateCard.length; l++) {
            var Duration = parseFloat($scope.RateCard[l].ComboPackDuration1);
            var price = parseFloat($scope.RateCard[l].ComboPackPrice);
            $scope.RateCard[l].ComboPackDuration = Duration * Quantity;
            $scope.RateCard[l].ComboPackAmount = price * Quantity;
            $scope.RateCard[l].ComboPackQuantity = Quantity;
            if ($scope.Cart.length != 0) {
                var ComboPackId = $scope.RateCard[l].ComboPackId;
                for (var k = 0; k < $scope.Cart.length; k++) {
                    if (ComboPackId == $scope.Cart[k].ComboPackId) {
                        $scope.Cart[k].Quantity = $scope.RateCard[index].ComboPackQuantity;
                        $scope.Cart[k].Duration = $scope.RateCard[index].ComboPackDuration;
                        $scope.Cart[k].Amount = $scope.RateCard[index].ComboPackAmount;

                    }
                }
            }
        }
        if ($scope.Cart.length != 0) {
            localStorage["Cart"] = JSON.stringify($scope.Cart);
        }
        var ele = "";
        //var duration = 0;
        //for (var i = 0; i < $scope.RateCard.length; i++)
        //    duration += parseFloat($scope.RateCard[i].Duration);
        //$scope.RateCard[0].ComboPackDuration = duration;
        //$scope.RateCard[0].ComboPackDuration1 = duration;
        ele += '<tr><td data-title="Name">' + $scope.RateCard[0].ComboPackName + '</td>'
                       + '<td data-title="Quantity"><a style="cursor: pointer; font-weight: bold;" ng-click="ChangeQuantityMinus(' + 0 + ')"><</a>&nbsp;'
                           + $scope.RateCard[0].ComboPackQuantity
                           + '&nbsp;<a style="cursor: pointer; font-weight: bold;" ng-click="ChangeQuantityPlus(' + 0 + ')">></a></td>'
                       //+ '<td data-title="Duration">' + $scope.RateCard[0].ComboPackDuration + 'min</td>'
                      + '<td data-title="Price"><span class="fa fa-usd"></span>' + $scope.RateCard[0].ComboPackPrice + '</td>'
                      + '<td data-title="Amount"><span class="fa fa-usd"></span>' + $scope.RateCard[0].ComboPackAmount + '</td>'
                      + "<td data-title='Add(OR)Remove'><a class='btn btn-sm  btn-primary add-to-cart' ng-click='SelectService( )'><span class='fa fa-cart-plus'  id='spn0'></span>Add to cart</a>"
                       + '&nbsp;&nbsp;<a ng-show="acRemove" class="btn-remove" style="cursor: pointer;" ng-click="RemoveRate()"><i class="fa fa-times-circle"></i></a>'
                       + "</td>"//<a class='btn btn-sm btn-primary add-to-cart' ng-click='SelectService(" + 0 + "," + $scope.RateCard[0].ComboPackId + ")'><span class='fa fa-cart-plus' id='spn0'></span>Add to cart</a></td>"
                       + "</tr>"
                   + "<tr><td>Services</td><td></td><td></td><td></td><td></td><td></td></tr>";
        for (var i = 0; i < $scope.RateCard.length; i++) {
            ele += "<tr id='tr'" + i + ">"
            + "<td>" + $scope.RateCard[i].Name + "</td>"
             + "<td></td>"
            //  + '<td><a style="cursor: pointer; font-weight: bold;" ng-click="ChangeQuantityMinus(' + i + ')">-</a>&nbsp;'
             //   + $scope.RateCard[i].Quantity
            //    + '&nbsp;<a style="cursor: pointer; font-weight: bold;" ng-click="ChangeQuantityPlus(' + i + ')">+</a></td>'
            //+ "<td>" + $scope.RateCard[i].Duration + "min</td>"
            + "<td><span class='fa fa-usd'></span>" + $scope.RateCard[i].Price + "</td>"

            + "<td></td><td></td>"
            + "</tr>";
            // + "<td><span class='fa fa-usd'></span>" + $scope.RateCard[i].Amount + "</td>"
            // + "<td><a class='btn btn-sm btn-primary add-to-cart' ng-click='SelectService(" + i + "," + $scope.RateCard[i].ServiceId + ")'><span class='fa fa-cart-plus' id='spn" + i + "'></span>Add to cart</a></td>"

        }
        var temp = $compile(ele)($scope);
        angular.element(document.getElementById('tbody')).append(temp);
        $scope.CheckExistingServices();
        $("#cardbody").empty();
        $("#selectedservices").css("display", "none");

        $scope.TotalTime = 0;
        $scope.TotalAmount = 0;
    }
    $scope.ChangeQuantityPlus = function (index) {
        var Quantity = parseInt($scope.RateCard[index].ComboPackQuantity);
        Quantity++;
        for (var l = 0; l < $scope.RateCard.length; l++) {
            var Duration = parseFloat($scope.RateCard[l].ComboPackDuration1);
            var price = parseFloat($scope.RateCard[l].ComboPackPrice);
            $scope.RateCard[l].ComboPackDuration = Duration * Quantity;
            $scope.RateCard[l].ComboPackAmount = price * Quantity;
            $scope.RateCard[l].ComboPackQuantity = Quantity;
            if ($scope.Cart.length != 0) {
                var ComboPackId = $scope.RateCard[l].ComboPackId;
                for (var k = 0; k < $scope.Cart.length; k++) {
                    if (ComboPackId == $scope.Cart[k].ComboPackId) {
                        $scope.Cart[k].Quantity = $scope.RateCard[index].ComboPackQuantity;
                        $scope.Cart[k].Duration = $scope.RateCard[index].ComboPackDuration;
                        $scope.Cart[k].Amount = $scope.RateCard[index].ComboPackAmount;

                    }
                }
            }
        }
        if ($scope.Cart.length != 0) {
            localStorage["Cart"] = JSON.stringify($scope.Cart);
        }
        $("#tbody").empty();
        var ele = "";
        var duration = 0;
        //for (var i = 0; i < $scope.RateCard.length; i++)
        //    duration += parseFloat($scope.RateCard[i].Duration);
        //$scope.RateCard[0].ComboPackDuration = duration;
        //$scope.RateCard[0].ComboPackDuration1 = duration;
        ele += '<tr><td data-title="Name">' + $scope.RateCard[0].ComboPackName + '</td>'
                      + '<td data-title="Quantity"><a style="cursor: pointer; font-weight: bold;" ng-click="ChangeQuantityMinus(' + 0 + ')"><</a>&nbsp;'
                          + $scope.RateCard[0].ComboPackQuantity
                          + '&nbsp;<a style="cursor: pointer; font-weight: bold;" ng-click="ChangeQuantityPlus(' + 0 + ')">></a></td>'
                      //+ '<td data-title="Duration">' + $scope.RateCard[0].ComboPackDuration + 'min</td>'
                     + '<td data-title="Price"><span class="fa fa-usd"></span>' + $scope.RateCard[0].ComboPackPrice + '</td>'
                     + '<td data-title="Amount"><span class="fa fa-usd"></span>' + $scope.RateCard[0].ComboPackAmount + '</td>'
                     + "<td data-title='Add(OR)Remove'><a class='btn btn-sm  btn-primary add-to-cart' ng-click='SelectService( )'><span class='fa fa-cart-plus'  id='spn0'></span>Add to cart</a>"
                      + '&nbsp;&nbsp;<a ng-show="acRemove" class="btn-remove" style="cursor: pointer;" ng-click="RemoveRate()"><i class="fa fa-times-circle"></i></a>'
                      + "</td>"//<a class='btn btn-sm btn-primary add-to-cart' ng-click='SelectService(" + 0 + "," + $scope.RateCard[0].ComboPackId + ")'><span class='fa fa-cart-plus' id='spn0'></span>Add to cart</a></td>"
                      + "</tr>"
                  + "<tr><td>Services</td><td></td><td></td><td></td><td></td><td></td></tr>";
        for (var i = 0; i < $scope.RateCard.length; i++) {
            ele += "<tr id='tr'" + i + ">"
            + "<td>" + $scope.RateCard[i].Name + "</td>"
             + "<td></td>"
            //  + '<td><a style="cursor: pointer; font-weight: bold;" ng-click="ChangeQuantityMinus(' + i + ')">-</a>&nbsp;'
             //   + $scope.RateCard[i].Quantity
            //    + '&nbsp;<a style="cursor: pointer; font-weight: bold;" ng-click="ChangeQuantityPlus(' + i + ')">+</a></td>'
            //+ "<td>" + $scope.RateCard[i].Duration + "min</td>"
            + "<td><span class='fa fa-usd'></span>" + $scope.RateCard[i].Price + "</td>"

            + "<td></td><td></td>"
            + "</tr>";
            // + "<td><span class='fa fa-usd'></span>" + $scope.RateCard[i].Amount + "</td>"
            // + "<td><a class='btn btn-sm btn-primary add-to-cart' ng-click='SelectService(" + i + "," + $scope.RateCard[i].ServiceId + ")'><span class='fa fa-cart-plus' id='spn" + i + "'></span>Add to cart</a></td>"

        }
        var temp = $compile(ele)($scope);
        angular.element(document.getElementById('tbody')).append(temp);
        $scope.CheckExistingServices();
        $("#cardbody").empty();
        $("#selectedservices").css("display", "none");

        $scope.TotalTime = 0;
        $scope.TotalAmount = 0;
    }
    $scope.RedirectToService = function () {

        if (localStorage.RegisterLoginId != "" && localStorage.RegisterLoginId != undefined && localStorage.Name != "" && localStorage.Name != undefined) {

            if (localStorage["Cart"] == "null" || localStorage["Cart"] == undefined) {
                $scope.AlertMsg = "Please Select Any Service.";
                return false;
            }
            else {

                location.href = "Services.aspx";
            }
        }
        else {
            openLoginModal();
        }
    }

    $scope.GetMyAccount = function () {
        location.href = "MyAccount.aspx";
    }

    if (localStorage.RegisterLoginId != "" && localStorage.RegisterLoginId != undefined && localStorage.Name != "" && localStorage.Name != undefined) {

        $scope.User = false;
        $scope.User1 = true;
        $scope.username = localStorage.Name + ' ' + localStorage.LastName;

    }
    else {

        $scope.User = true;
        $scope.User1 = false;
        $scope.username = "No Name";
    }

    $scope.LogOut = function () {

        localStorage.Email = "";
        localStorage.RegisterLoginId = "";
        localStorage.Name = "";
        localStorage.LastName = "";
        localStorage.Password = "";

        $scope.User = true;
        $scope.User1 = false;
        $scope.username = "";

        location.href = "Default.aspx";
    }

    $scope.loginAjax = function () {

        var check = false;

        if ($scope.LoginEmail == "" || $scope.LoginEmail == undefined) {
            $("#txtemail").css("border-bottom-color", "red");
            check = true;
        }
        else {
            $("#txtemail").css("border-bottom-color", "");
        }
        if (!validateEmail($scope.LoginEmail)) {
            $("#txtemail").css("border-bottom-color", "red");
            check = true;
        }
        else {
            $("#txtemail").css("border-bottom-color", "");
        }

        if ($scope.LoginPwd == "" || $scope.LoginPwd == undefined) {
            $("#txtpwd").css("border-bottom-color", "red");
            check = true;
        }
        else {
            $("#txtpwd").css("border-bottom-color", "");
        }

        if (check) {
            return false;
        }

        var params = {};

        params = {
            'Email': $scope.LoginEmail, 'Password': $scope.LoginPwd
        };

        url = "Default.asmx/GetLoginUser",
        $http.get(url, { params: params }).success(function (data) {
            if (data != "404") {

                if (data != "") {

                    var mydata = JSON.parse(data);

                    $scope.totalData = JSON.parse(mydata);

                    if ($scope.totalData != null) {

                        $scope.LoginEmail = '';
                        $scope.LoginPwd = '';

                        localStorage.Email = $scope.totalData.Email;
                        localStorage.RegisterLoginId = $scope.totalData.RegisterLoginId;
                        localStorage.Name = $scope.totalData.Name;
                        localStorage.LastName = $scope.totalData.LastName;
                        localStorage.Password = $scope.totalData.Password;
                        localStorage.Mobile = $scope.totalData.Mobile;

                        $scope.User = false;
                        $scope.User1 = true;
                        $scope.username = $scope.totalData.Name + ' ' + $scope.totalData.LastName;

                        $("#loginModal").modal("hide");
                        //alert("Success");

                    }
                    else {
                        alert("Invalid Email or Password");
                        $scope.LoginEmail = '';
                        $scope.LoginPwd = '';
                    }
                }
                else {
                    alert("Not Valid User");
                }
            }
            else {
                window.location.href = "../Common/Login.aspx";
            }
        }), Error(function (result) {
            alert(result);
        });
    }

    validateEmail = function ($email) {
        if ($email != undefined) {
            var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
            //var emailReg = /^[a-z 0-9]+@[a-z]+\.[a-z]{2,5}$/;
            return emailReg.test($email);
        }
        else { }
    }

    $scope.RegLogin = function () {

        var check = false;
        if ($scope.SName == "" || $scope.SName == undefined) {
            $("#SName").css("border-bottom-color", "red");
            check = true;
        }
        else {
            $("#SName").css("border-bottom-color", "");
        }
        if ($scope.SMobile == "" || $scope.SMobile == undefined || $scope.SMobile.length != 10) {
            $("#SMobile").css("border-bottom-color", "red");
            check = true;
        }
        else {
            $("#SMobile").css("border-bottom-color", "");
        }
        if ($scope.SEmail == "" || $scope.SEmail == undefined) {
            //alert("Please Enter Email.");
            $("#SEmail").css("border-bottom-color", "red");
            check = true;
        }
        else {
            $("#SEmail").css("border-bottom-color", "");
        }
        if (!validateEmail($scope.SEmail)) {
            $("#SEmail").css("border-bottom-color", "red");
            check = true;
        }
        else {
            $("#SEmail").css("border-bottom-color", "");
        }

        if ($scope.SPassword == "" || $scope.SPassword == undefined) {
            $("#SPassword").css("border-bottom-color", "red");
            check = true;
        }
        else {
            $("#SPassword").css("border-bottom-color", "");
        }

        if ($scope.SCPassword == "" || $scope.SCPassword == undefined) {
            $("#SCPassword").css("border-bottom-color", "red");
            check = true;
        }
        else {
            $("#SCPassword").css("border-bottom-color", "");
        }

        if ($scope.SPassword != $scope.SCPassword) {
            $("#SPassword").css("border-bottom-color", "red");
            $("#SCPassword").css("border-bottom-color", "red");
            check = true;
        }
        else {
            $("#SPassword").css("border-bottom-color", "");
            $("#SCPassword").css("border-bottom-color", "");

        }

        if (check) {
            return false;
        }

        var SaveData = {};

        SaveData = {
            'Name': $scope.SName, 'Mobile': $scope.SMobile, 'Email': $scope.SEmail, 'Password': $scope.SPassword, 'ConfirmPassword': $scope.SCPassword,
        };

        var request = {
            method: 'POST',
            url: "Default.asmx/RegLogin",
            headers: {
                'Content-Type': undefined
            },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("savedata", angular.toJson(data.savedata));

                return formData;
            },

            data: { 'savedata': SaveData, }
        }

        $http(request).success(function (data) {
            if (data != "404") {

                if (data != "0") {

                    localStorage.Email = $scope.SEmail;
                    localStorage.RegisterLoginId = data;
                    localStorage.Name = $scope.SName;
                    localStorage.LastName = $scope.SLastName;
                    localStorage.Password = $scope.SPassword;
                    localStorage.Mobile = $scope.SMobile;

                    $scope.User = false;
                    $scope.User1 = true;
                    $scope.username = $scope.SName + ' ' + $scope.SLastName;

                    $("#loginModal").modal("hide");

                    //$scope.SName = '';

                    //$scope.SMobile = '';

                    //$scope.SEmail = '';

                    //$scope.SPassword = '';

                    //$scope.SCPassword = '';

                    //$('#loginModal .registerBox').fadeOut('fast', function () {
                    //    $('#loginModal .forgotBox').fadeOut('fast', function () {
                    //        $('#loginModal .NewregisterBox').fadeOut('fast', function () {
                    //            $('.loginBox').fadeOut('fast');
                    //            $('.login-footer').fadeOut('fast', function () {
                    //                $('.register-footer').fadeIn('fast');
                    //            });

                    //            $('.modal-title').html('Successfully Regestered..');
                    //        });
                    //    });
                    //});

                }
                else {
                    //$('.modal-title').html('Record already exists');
                    alert("Record already exists with same email");

                    $scope.SName = "";
                    $scope.SLastName = "";
                    $scope.SMobile = "";
                    $scope.SEmail = "";
                    $scope.SPassword = "";
                    $scope.SCPassword = "";
                }
            }
            else {
                window.location.href = "../Common/Login.aspx";
            }
        }), Error(function (result) {
            alert(result);
        });
    }

    $scope.GetPwd = function () {

        var check = false;

        if ($scope.FGEmail == "" || $scope.FGEmail == undefined) {
            $("#FGEmail").css("border-bottom-color", "red");
            check = true;
        }
        else {
            $("#FGEmail").css("border-bottom-color", "");
        }
        if (!validateEmail($scope.FGEmail)) {
            $("#FGEmail").css("border-bottom-color", "red");
            check = true;
        }
        else {
            $("#FGEmail").css("border-bottom-color", "");
        }

        if (check) {
            return false;
        }

        var params = {};

        params = {
            'Email': $scope.FGEmail
        };

        url = "Default.asmx/GetPwd",
        $http.get(url, { params: params }).success(function (data) {
            if (data != "404") {

                if (data != "") {

                    var mydata = JSON.parse(data);

                    $scope.totalData = JSON.parse(mydata);

                    if ($scope.totalData != 0) {

                        $scope.FGEmail = '';

                        $scope.RegisterLoginId = $scope.totalData;

                        $('.forgotBox').fadeOut('fast', function () {
                            $('.login-footer').fadeOut('fast', function () {
                            });
                            //$('.modal-title').html('An Email with a link to reset your password has been sent to your email address');
                            $('.modal-title').html('An Email to reset your password has been sent');
                        });
                    }
                    else {
                        $scope.FGEmail = '';
                        $('.modal-title').html('not a registered email');
                    }

                }
                else {
                    $('.modal-title').html("Not Valid User");
                }
            }
            else {
                window.location.href = "../Common/Login.aspx";
            }
        }), Error(function (result) {
            alert(result);
        });
    }

    $scope.ChangePwd = function () {

        var check = false;
        if ($scope.NSPassword == "" || $scope.NSPassword == undefined) {
            $("#NSPassword").css("border-bottom-color", "red");
            check = true;
        }
        else {
            $("#NSPassword").css("border-bottom-color", "");
        }

        if ($scope.NSCPassword == "" || $scope.NSCPassword == undefined) {
            $("#NSCPassword").css("border-bottom-color", "red");
            check = true;
        }
        else {
            $("#NSCPassword").css("border-bottom-color", "");
        }

        if ($scope.NSPassword != $scope.NSCPassword) {
            $("#NSPassword").css("border-bottom-color", "red");
            $("#NSCPassword").css("border-bottom-color", "red");
            check = true;
        }
        else {
            $("#NSPassword").css("border-bottom-color", "");
            $("#NSCPassword").css("border-bottom-color", "");
        }

        if (check) {
            return false;
        }

        var SaveData = {};

        SaveData = {
            'Password': $scope.NSPassword, 'ConfirmPassword': $scope.NSCPassword, 'RegisterLoginId': $scope.RegisterLoginId
        };

        var request = {
            method: 'POST',
            url: "Default.asmx/ChangePwd",
            headers: {
                'Content-Type': undefined
            },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("savedata", angular.toJson(data.savedata));

                return formData;
            },

            data: { 'savedata': SaveData, }
        }

        $http(request).success(function (data) {
            if (data != "404") {

                if (data != "") {

                    $scope.NSPassword = '';

                    $scope.NSCPassword = '';

                    $('#loginModal .NewregisterBox').fadeOut('fast', function () {
                        $('.loginBox').fadeIn('fast');
                        $('.register-footer').fadeOut('fast', function () {
                            $('.login-footer').fadeIn('fast');
                        });

                        $('.modal-title').html('Password successfully changed..');
                    });

                }
                else {
                    $('#loginModal .NewregisterBox').fadeOut('fast', function () {
                        //$('.loginBox').fadeIn('fast');
                        $('.register-footer').fadeOut('fast', function () {
                            $('.login-footer').fadeIn('fast');
                        });

                        $('.modal-title').html('Can not change the password not a valid details');
                    });
                }
            }
            else {
                window.location.href = "../Common/Login.aspx";
            }
        }), Error(function (result) {
            alert(result);
        });
    }
});