var mainApp = angular.module("NaturalHomesApp", []);
mainApp.controller('NaturalHomeController', function ($scope, $http, $compile) {
    $("#imgloader").css("display", "block");
    if (localStorage.getItem("SubCategoryId") != undefined) {
        $scope.SubCategoryId = localStorage.getItem("SubCategoryId");
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
    $scope.SelectCity = function (index) {
        //if (localStorage["Cart"] != undefined && localStorage["Cart"] != "null"&&localStorage["Cart"]!=null)
        //{
        //    $scope.AlertMsg = "Please Empty Cart to change city.";
        //    return false;
        //}
        $scope.AlertMsg = "";
        $scope.SelectedIndex = index;
        $scope.SelectedName = $scope.Cities[index].Name;
        $scope.Firstcity = $scope.Cities[index].Name;
    }
    $scope.GetCities();
    $scope.RedirectToHome = function () {
        location.href = "Default.aspx";
    }
    $scope.GetMyAccount = function () {
        location.href = "MyAccount.aspx";
    }
    $scope.GetServices = function () {
        $("#imgloader").css("display", "block");
        //$("#imgloader").css("display", "block");
        var SubCategoryId;
        if ($scope.SubCategoryId == undefined || $scope.SubCategoryId == null || $scope.SubCategoryId == "" || $scope.SubCategoryId == 0)
            ServiceId = 0;
        else
            SubCategoryId = $scope.SubCategoryId;
        var url = "Default.asmx/GetData";
        //var weekday = "";
        //if (localStorage.weekdaysRTRC == "fromProducts") {
        //    weekday = localStorage.weekdays;
        //}
        //else {
        //    weekday = "Today";
        //}
        //localStorage.setItem("weekdaysRTRC", "");
        var weekday = localStorage.weekdays;
        var params = {}
        $http.get(url, { params: { 'TandT': weekday } }).success(function (data) {
            var d = JSON.parse(data);
            $scope.Categories = JSON.parse(d);
           
            var myEl = angular.element(document.querySelector('#maindiv'));
            var ele = "";
            for (var i = 0; i < $scope.Categories.length; i++) {
                var str = GetString(i);
                //var ele = angular.element($event.target).parent();
                // if (i != 0) {
                ele += '<div class="panel panel-default"> '
                    + '<div id="dvact' + i + '" class="panel-heading">'
                 + ' <h4 class="panel-title">'
                 + ' <a id="anc' + (i) + '" class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#' + str + '"  ng-click="Changesign(' + i + ',' + str + ')">'
                 + '<span class="glyphicon glyphicon-plus pull-right"></span>'
                 + $scope.Categories[i].Name
                 + ' </a>'
                 + '  </h4>'
                 + ' </div>'
                 + ' <div id=' + str + ' class="panel-collapse collapse"  >'
                 + '  <div class="panel-body">'
                 + '<ul class="service-list" id="subcat' + i + '">'
                 + '</ul>'
                 + '</div>'
                 + ' </div>'
                 + ' </div>'

            }
            var temp = $compile(ele)($scope);
            angular.element(document.getElementById('maindiv')).append(temp);
            for (var i = 0; i < $scope.Categories.length; i++) {
                var SubCategory = $scope.Categories[i].SubCategory;
                var el = "";
                for (var j = 0; j < SubCategory.length; j++) {
                    el += '<li id="ac' + i + "" + j + '"  style="cursor:pointer;background-color: white;color: #2b2a2b;"><a  ng-click="GetRateCard(' + $scope.Categories[i].CategoryId + ',' + SubCategory[j].SubCategoryId + ',' + i + ',' + j + ')"><img  src="img/SubCategoryPics/' + SubCategory[j].Image + '"/>'
                            + SubCategory[j].Name
                            + '</a></li>'
                    // );
                }
                var temp1 = $compile(el)($scope);
                angular.element(document.getElementById("subcat" + i)).append(temp1);

            }
            var count = 0;
            if ($scope.SubCategoryId != undefined && $scope.SubCategoryId != "null") {
                for (var i = 0; i < $scope.Categories.length; i++) {
                    var SubCategory = $scope.Categories[i].SubCategory;
                    for (var j = 0; j < SubCategory.length; j++) {
                        if (SubCategory[j].SubCategoryId == $scope.SubCategoryId) {
                            count++;
                            $scope.ActiveIndex = i;
                            var id = $scope.SubCategoryId;
                            $scope.ServiceOffer = SubCategory[j].Name;
                            $scope.GetRateCard(0, id, i, j);

                            // localStorage.setItem("SubCategoryId", null);
                        } 
                    }

                }
                if (count == 0)
                {
                    $scope.GetRateCard($scope.Categories[0].CategoryId, $scope.Categories[0].SubCategory[0].SubCategoryId, 0, 0);
                }
            }
            else
                $scope.GetRateCard($scope.Categories[0].CategoryId, $scope.Categories[0].SubCategory[0].SubCategoryId, 0, 0);
            // CheckStatus();
        },
        Error(function (result) {
            $("#imgloader").css("display", "none");
        }));
    }
    $scope.ChangeColor = function () {
        for (var i = 0; i < $scope.Categories.length; i++) {
            var SubCategory = $scope.Categories[i].SubCategory;
            for (var j = 0; j < SubCategory.length; j++) {
                $("#ac" + i + "" + j).css("background-color", "white");
                $("#ac" + i + "" + j).css("color", "#2b2a2b");
            }
        }
    }
    $scope.Changesign = function (i, str) {
        var k = 0;
        for (var j = 0; j < $scope.Categories.length; j++) {

            var str = GetString(j);
            if (i != j) {
                if ($('#' + str).hasClass("collapse in")) {
                    $("#" + str).removeClass("collapse in").addClass("collapse");
                    $("#anc" + j).children().removeClass("glyphicon-minus").addClass("glyphicon-plus");
                }
            }
        }
        var str = GetString(i);
        if ($("#anc" + i).children().hasClass("glyphicon-plus")) {
            $("#anc" + i).children().removeClass("glyphicon-plus").addClass("glyphicon-minus");

        }
        else if ($("#anc" + i).children().hasClass("glyphicon-minus")) {
            $("#anc" + i).children().removeClass("glyphicon-minus").addClass("glyphicon-plus");

        }

        //if ($("#anc" + i).hasClass("glyphicon-plus"))
        //{
        //    $("#anc" + i).removeClass("glyphicon-minus").addClass("glyphicon-minus");
        //}
        //$('.collapse').on('shown.bs.collapse', function () {
        //    $(this).parent().find(".glyphicon-plus").removeClass("glyphicon-plus").addClass("glyphicon-minus");
        //})
        //        .on('hidden.bs.collapse', function () {
        //            $(this).parent().find(".glyphicon-minus").removeClass("glyphicon-minus").addClass("glyphicon-plus");
        //        });

        //$('.accordion-toggle').each(function () {
        //    if ($(this).children().hasClass('glyphicon-minus')) {
        //        $(this).parent().parent().addClass("panel-heading-active");
        //    }
        //});

        $('.panel-heading').click(function () {
            if ($('.panel-heading').hasClass('panel-heading-active')) {
                $('.panel-heading').removeClass('panel-heading-active');
                $(this).addClass("panel-heading-active");
            }
        });

        //$(".add-to-cart").click(function () {
        //    $(".rate-card").addClass('selected-service-visible')
        //    $(".selected-services").show();
        //    $(this).parent().parent().addClass('selected-srvc');
        //    $(this).children().removeClass('fa-cart-plus').addClass('fa-check');
        //});
    }

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
            case 26: return "collapseTwentysix";
                break;
        }
    }
    $scope.ChangeQuantityMinus = function (index) {
        var Quantity = parseInt($scope.RateCard[index].Quantity);
        Quantity--;
        if (Quantity <= 0) {
            alert("Quantity Cannot be negative.");
            $scope.RateCard[index].Quantity = 1;
            $scope.RateCard[index].Duration = $scope.RateCard[index].Duration1;
            $scope.RateCard[index].Amount = $scope.RateCard[index].Price;
            return false;
        }
        $("#tbody").empty();
        var Duration = parseFloat($scope.RateCard[index].Duration1);
        var price = parseFloat($scope.RateCard[index].Price);
        $scope.RateCard[index].Duration = Duration * Quantity;
        $scope.RateCard[index].Amount = parseFloat(price * Quantity).toFixed(2);
        $scope.RateCard[index].Quantity = Quantity;
        if ($scope.Cart.length != 0) {
            var serviceid = $scope.RateCard[index].ServiceId;
            for (var k = 0; k < $scope.Cart.length; k++) {
                if ($scope.Cart[k].Type == "NonCombo") {
                    if (serviceid == $scope.Cart[k].ServiceId) {
                        $scope.Cart[k].Quantity = $scope.RateCard[index].Quantity;
                        $scope.Cart[k].Duration = $scope.RateCard[index].Duration;
                        $scope.Cart[k].Amount = $scope.RateCard[index].Amount;
                        localStorage["Cart"] = JSON.stringify($scope.Cart);
                    }
                }
            }
        }
        var ele = "";
        for (var i = 0; i < $scope.RateCard.length; i++) {
            ele += "<tr id='tr'" + i + " >"
                        + "<td data-title='Name'>" + $scope.RateCard[i].Name + "</td>"
                        //+ "<td><input type='number' style='border-bottom:0px;width:20%;' value=" + $scope.RateCard[i].Quantity + " ng-change='ChangeQty(" + i + ")' /></td>"
                         + '<td data-title="Quantity"><a style="cursor: pointer; font-weight: bold;" src="" ng-click="ChangeQuantityMinus(' + i + ')"><</a>&nbsp;'
                       //+ "<td> <select id='select" + i + "' ng-model='Id'  ng-change='ChangeQuantity(" + i + ")'>"
                       //+"<option ng-repeat='j in '"+$scope.Qtyarray+" value=j."+Name+">j."+Id+"</option>"
                       //+"</select> </td>"
                         + $scope.RateCard[i].Quantity
                        + '&nbsp;<a style="cursor: pointer; font-weight: bold;" ng-click="ChangeQuantityPlus(' + i + ')">></a></td>'
                       //+ "<td data-title='Duration'>" + $scope.RateCard[i].Duration + "min</td>"
                       + "<td data-title='Price'><span class='fa fa-usd'></span>" + $scope.RateCard[i].Price + "</td>"
                       + "<td data-title='Amount'><span class='fa fa-usd'></span>" + $scope.RateCard[i].Amount + "</td>"
                       + "<td ><a class='btn btn-sm btn-primary add-to-cart' ng-click='SelectService(" + i + "," + $scope.RateCard[i].ServiceId + ")'><span class='fa fa-cart-plus'  id='spn" + i + "'></span>Add</a>"
                       + '&nbsp;&nbsp;<a ng-show=' + $scope.RateCard[i].acRemove + ' class="btn-remove" style="cursor: pointer;" ng-click="RemoveRate(' + i + ')"><i class="fa fa-times-circle"></i></a>'
                       + "</td>>/tr>";

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
        var Quantity = parseInt($scope.RateCard[index].Quantity);
        Quantity++;
        var Duration = parseFloat($scope.RateCard[index].Duration1);
        var price = parseFloat($scope.RateCard[index].Price);
        $scope.RateCard[index].Duration = Duration * Quantity;
        $scope.RateCard[index].Amount = parseFloat(price * Quantity).toFixed(2);
        $scope.RateCard[index].Quantity = Quantity;
        if ($scope.Cart.length != 0) {
            var serviceid = $scope.RateCard[index].ServiceId;
            for (var k = 0; k < $scope.Cart.length; k++) {
                if (serviceid == $scope.Cart[k].ServiceId) {
                    $scope.Cart[k].Quantity = $scope.RateCard[index].Quantity;
                    $scope.Cart[k].Duration = $scope.RateCard[index].Duration;
                    $scope.Cart[k].Amount = $scope.RateCard[index].Amount;
                    localStorage["Cart"] = JSON.stringify($scope.Cart);
                }
            }
        }
        $("#tbody").empty();
        var ele = "";
        for (var i = 0; i < $scope.RateCard.length; i++) {
            ele += "<tr id='tr'" + i + " >"
                       + "<td data-title='Name'>" + $scope.RateCard[i].Name + "</td>"
                       //+ "<td><input type='number' style='border-bottom:0px;width:20%;' value=" + $scope.RateCard[i].Quantity + " ng-change='ChangeQty(" + i + ")' /></td>"
                        + '<td data-title="Quantity"><a style="cursor: pointer; font-weight: bold;" src="" ng-click="ChangeQuantityMinus(' + i + ')"><</a>&nbsp;'
                      //+ "<td> <select id='select" + i + "' ng-model='Id'  ng-change='ChangeQuantity(" + i + ")'>"
                      //+"<option ng-repeat='j in '"+$scope.Qtyarray+" value=j."+Name+">j."+Id+"</option>"
                      //+"</select> </td>"
                        + $scope.RateCard[i].Quantity
                       + '&nbsp;<a style="cursor: pointer; font-weight: bold;" ng-click="ChangeQuantityPlus(' + i + ')">></a></td>'
                      //+ "<td data-title='Duration'>" + $scope.RateCard[i].Duration + "min</td>"
                      + "<td data-title='Price'><span class='fa fa-usd'></span>" + $scope.RateCard[i].Price + "</td>"
                      + "<td data-title='Amount'><span class='fa fa-usd'></span>" + $scope.RateCard[i].Amount + "</td>"
                      + "<td ><a class='btn btn-sm btn-primary add-to-cart' ng-click='SelectService(" + i + "," + $scope.RateCard[i].ServiceId + ")'><span class='fa fa-cart-plus'  id='spn" + i + "'></span>Add</a>"
                      + '&nbsp;&nbsp;<a ng-show=' + $scope.RateCard[i].acRemove + ' class="btn-remove" style="cursor: pointer;" ng-click="RemoveRate(' + i + ')"><i class="fa fa-times-circle"></i></a>'
                      + "</td>>/tr>";

        }
        var temp = $compile(ele)($scope);
        angular.element(document.getElementById('tbody')).append(temp);
        $scope.CheckExistingServices();
        $("#cardbody").empty();
        $("#selectedservices").css("display", "none");

        $scope.TotalTime = 0;
        $scope.TotalAmount = 0;
    }
    //if(localStorage.getItem("CategoryId")!=undefined && localStorage.getItem("CategoryId"!="null")

    // $scope.Cart = [];
    if (localStorage["Cart"] == "null" || localStorage["Cart"] == undefined) {
        $scope.Cart = [];
        $scope.ShopCount = 0;
    }
    else {
        $scope.Cart = JSON.parse(localStorage["Cart"]);
        $scope.ShopCount = $scope.Cart.length;
    }
    $scope.GetRateCard = function (CategoryId, SubCategoryId, index1, index2) {
        $("#imgloader").css("display", "block");
        $scope.ServiceOffer = $scope.Categories[index1].SubCategory[index2].Name;
        var CityId = 0;
        CityId = $scope.Cities[$scope.SelectedIndex].CityId;
        if (CategoryId == undefined && SubCategoryId == undefined) {

            CategoryId = 0;
            SubCategoryId = 0;
        }
        if (CategoryId == 0) {
            {
                $scope.Changesign($scope.ActiveIndex, "");
                var str = GetString($scope.ActiveIndex);
                if ($('#' + str).hasClass("collapse")) {
                    $("#" + str).removeClass("collapse ").addClass("collapse in");
                    //$("#anc" + j).children().removeClass("glyphicon-plus").addClass("glyphicon-minus");
                }
                $("#dvact" + $scope.ActiveIndex).addClass("panel-heading-active");

            }
        }
        $scope.ChangeColor();
        $("#ac" + index1 + "" + index2).css("background-color", "#e4c121");
        $("#ac" + index1 + "" + index2).css("color", "#fff");
        //var weekday = "";
        //if (localStorage.weekdaysRTRC == "fromProducts") {
        //    weekday = localStorage.weekdays;
        //}
        //else {
        //    weekday = "Today";
        //}
        //localStorage.setItem("weekdaysRTRC", "");
        var weekday = localStorage.weekdays;
        var params = { 'CategoryId': CategoryId, 'SubCategoryId': SubCategoryId, 'CityId': CityId, 'weekdays': weekday };
        var url = "Default.asmx/GetRateCard";
        $http.get(url, { params: params }).success(function (data) {
            $("#tbody").empty();

            // $("#imgloader").css("display", "none");
            var RateCard = JSON.parse(data);
            RateCard = JSON.parse(RateCard);
            if (typeof (RateCard) == "object") {
                if (RateCard.length > 0) {
                    $scope.RateCard = RateCard;
                    var ele = "";
                    $scope.selectedrows = 0;
                    for (var i = 0; i < $scope.RateCard.length; i++) {
                        $scope.RateCard[i].acRemove = false;
                    }
                    for (var i = 0; i < $scope.RateCard.length; i++) {
                        var qty = $scope.RateCard[i].Quantity;
                        ele += "<tr id='tr'" + i + " >"
                        + "<td data-title='Name'>" + $scope.RateCard[i].Name + "</td>"
                        //+ "<td><input type='number' style='border-bottom:0px;width:20%;' value=" + $scope.RateCard[i].Quantity + " ng-change='ChangeQty(" + i + ")' /></td>"
                         + '<td data-title="Quantity"><a style="cursor: pointer; font-weight: bold;" src="" ng-click="ChangeQuantityMinus(' + i + ')"><</a>&nbsp;'
                       //+ "<td> <select id='select" + i + "' ng-model='Id'  ng-change='ChangeQuantity(" + i + ")'>"
                       //+"<option ng-repeat='j in '"+$scope.Qtyarray+" value=j."+Name+">j."+Id+"</option>"
                       //+"</select> </td>"
                         + $scope.RateCard[i].Quantity
                        + '&nbsp;<a style="cursor: pointer; font-weight: bold;" ng-click="ChangeQuantityPlus(' + i + ')">></a></td>'
                       //+ "<td data-title='Duration'>" + $scope.RateCard[i].Duration + "min</td>"
                       + "<td data-title='Price'><span class='fa fa-usd'></span>" + $scope.RateCard[i].Price + "</td>"
                       + "<td data-title='Amount'><span class='fa fa-usd'></span>" + $scope.RateCard[i].Amount + "</td>"
                       + "<td ><a id='actcard" + i + "' class='btn btn-sm btn-primary add-to-cart' ng-click='SelectService(" + i + "," + $scope.RateCard[i].ServiceId + ")'><span class='fa fa-cart-plus'  id='spn" + i + "'></span>Add</a>"
                       + '&nbsp;&nbsp;<a ng-show=' + $scope.RateCard[i].acRemove + ' class="btn-remove" style="cursor: pointer;" ng-click="RemoveRate(' + i + ')"><i class="fa fa-times-circle"></i></a>'
                       + "</td>>/tr>";

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
                else {
                    $("#imgloader").css("display", "none");
                }
            }

        },
        Error(function (result) {
            $("#imgloader").css("display", "none");
        }));
    }
    $scope.CheckExistingServices = function () {
        for (var i = 0; i < $scope.RateCard.length; i++) {
            for (var j = 0; j < $scope.Cart.length; j++) {
                if ($scope.RateCard[i].ServiceId == $scope.Cart[j].ServiceId) {
                    $scope.RateCard[i].Duration = $scope.Cart[j].Duration;
                    $scope.RateCard[i].Quantity = $scope.Cart[j].Quantity;
                    $scope.RateCard[i].Amount = $scope.Cart[j].Amount;
                    var cache = $('#actcard' + i).children();
                    $("#actcard" + i).append(cache).text("Added");
                    $("#spn" + i).removeClass("fa-cart-plus").addClass("fa-check");
                    $("#actcard" + i).removeClass("btn-primary").addClass("btn-primary-pink");
                    $scope.RateCard[i].acRemove = true;
                }
            }
        }
        $("#tbody").empty();
        var ele = "";
        $scope.selectedrows = 0;
        for (var i = 0; i < $scope.RateCard.length; i++) {
            var qty = $scope.RateCard[i].Quantity;
            ele += "<tr id='tr'" + i + " >"
                       + "<td data-title='Name'>" + $scope.RateCard[i].Name + "</td>"
                       //+ "<td><input type='number' style='border-bottom:0px;width:20%;' value=" + $scope.RateCard[i].Quantity + " ng-change='ChangeQty(" + i + ")' /></td>"
                        + '<td data-title="Quantity"><a style="cursor: pointer; font-weight: bold;" src="" ng-click="ChangeQuantityMinus(' + i + ')"><</a>&nbsp;'
                      //+ "<td> <select id='select" + i + "' ng-model='Id'  ng-change='ChangeQuantity(" + i + ")'>"
                      //+"<option ng-repeat='j in '"+$scope.Qtyarray+" value=j."+Name+">j."+Id+"</option>"
                      //+"</select> </td>"
                        + $scope.RateCard[i].Quantity
                       + '&nbsp;<a style="cursor: pointer; font-weight: bold;" ng-click="ChangeQuantityPlus(' + i + ')">></a></td>'
                      //+ "<td data-title='Duration'>" + $scope.RateCard[i].Duration + "min</td>"
                      + "<td data-title='Price'><span class='fa fa-usd'></span>" + $scope.RateCard[i].Price + "</td>"
                      + "<td data-title='Amount'><span class='fa fa-usd'></span>" + $scope.RateCard[i].Amount + "</td>"
                      + "<td ><a id='actcard" + i + "' class='btn btn-sm btn-primary add-to-cart' ng-click='SelectService(" + i + "," + $scope.RateCard[i].ServiceId + ")'><span class='fa fa-cart-plus'  id='spn" + i + "'></span>Add</a>"
                      + '&nbsp;&nbsp;<a ng-show=' + $scope.RateCard[i].acRemove + ' class="btn-remove" style="cursor: pointer;" ng-click="RemoveRate(' + i + ')"><i class="fa fa-times-circle"></i></a>'
                      + "</td>>/tr>";

        }
        var temp = $compile(ele)($scope);
        angular.element(document.getElementById('tbody')).append(temp);
        for (var i = 0; i < $scope.RateCard.length; i++) {
            for (var j = 0; j < $scope.Cart.length; j++) {
                if ($scope.RateCard[i].ServiceId == $scope.Cart[j].ServiceId) {
                    var cache = $('#actcard' + i).children();
                    $("#actcard" + i).text("Added").prepend(cache);
                    $("#spn" + i).removeClass("fa-cart-plus").addClass("fa-check");
                    $("#actcard" + i).removeClass("btn-primary").addClass("btn-primary-pink");
                    $scope.RateCard[i].acRemove = true;
                }
            }
        }
    }
    $scope.Qtyarray = [];
    for (var i = 0; i < 5; i++) {
        $scope.Qtyarray.push({ "Id": (i + 1), 'Name': (i + 1) })
    }
    $scope.ChangeQuantity = function (i) {
        alert(i);
    }
    CheckStatus1 = function (i) {
        alert(i);
    }
    $scope.RemoveRate = function (m, index) {
        var serviceid = $scope.RateCard[m].ServiceId;
        for (var i = 0; i < $scope.Cart.length; i++) {
            if ($scope.Cart[i].Type == "NonCombo") {
                if ($scope.Cart[i].ServiceId == serviceid) {
                    $scope.Cart.splice(i, 1);
                    // $scope.RateCard.splice(m, 1);
                    $scope.ShopCount = $scope.Cart.length;
                    $scope.RateCard[m].Duration = $scope.RateCard[m].Duration1;
                    $scope.RateCard[m].Quantity =1;
                    $scope.RateCard[m].Amount = $scope.RateCard[m].Price;
                    localStorage["Cart"] = JSON.stringify($scope.Cart);
                    $("#spn" + m).removeClass("fa-check ").addClass("fa-cart-plus");
                    $("#actcard" + m).text("Add");
                    $scope.RateCard[m].acRemove = false;
                    $scope.CheckExistingServices();
                }
            }

        }
    }
    $scope.SelectService = function (i, Id) {
        try {
            if ($("#spn" + i).hasClass("fa-cart-plus")) {
                $("#actcard" + i).text("Added to Cart");
                $("#spn" + i).removeClass("fa-cart-plus").addClass("fa-check");

                $scope.RateCard[i].acRemove = true;
                var check = true;
                if ($scope.Cart.length == 0) {
                    $scope.Cart.push({
                        'ServiceId': $scope.RateCard[i].ServiceId, 'Name': $scope.RateCard[i].Name, 'Duration': $scope.RateCard[i].Duration
                   , 'Price': $scope.RateCard[i].Price, 'Quantity': $scope.RateCard[i].Quantity, 'Amount': $scope.RateCard[i].Amount, 'Type': 'NonCombo'
                    });
                }
                else {
                    for (var j = 0; j < $scope.Cart.length; j++) {
                        if ($scope.RateCard[i].ServiceId == $scope.Cart[j].ServiceId) {
                            check = false;
                            break;
                        }
                    }
                    if (check) {
                        $scope.Cart.push({
                            'ServiceId': $scope.RateCard[i].ServiceId, 'Name': $scope.RateCard[i].Name, 'Duration': $scope.RateCard[i].Duration
                        , 'Price': $scope.RateCard[i].Price, 'Quantity': $scope.RateCard[i].Quantity, 'Amount': $scope.RateCard[i].Amount, 'Type': 'NonCombo'
                        });

                    }
                }
                $scope.ShopCount = $scope.Cart.length;
                localStorage["Cart"] = JSON.stringify($scope.Cart);
                $scope.CheckExistingServices();
            }
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
           + ' <a style="cursor: pointer; font-weight: bold;" ng-click="ChangeQuantityMinus($index)">-</a>&nbsp;'
           + ''
           + '  &nbsp;<a style="cursor: pointer; font-weight: bold;" ng-click="ChangeQuantityPlus($index)">+</a></td>'
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

    if (localStorage.RegisterLoginId != "" && localStorage.RegisterLoginId != undefined && localStorage.Name != "" && localStorage.Name != undefined) {

        $scope.User = false;
        $scope.User1 = true;
        $scope.username = localStorage.Name;

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