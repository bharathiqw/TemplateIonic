/*
 *
 * login-register modal
 * Autor: Creative Tim
 * Web-autor: creative.tim
 * Web script: http://creative-tim.com
 * 
 */
function showRegisterForm() {
    $('.loginBox').fadeOut('fast', function () {
        $('#loginModal .forgotBox').fadeOut('fast', function () {
            $('#loginModal .NewregisterBox').fadeOut('fast', function () {
                $('.registerBox').fadeIn('fast');
                $('.login-footer').fadeOut('fast', function () {
                    $('.register-footer').fadeIn('fast');
                });
                $('.modal-title').html('Sign up');
            });
        });
    });

    //$('.social-login').fadeOut('fast', function () {
    //});

    ////Hiding facebook and google login buttons.
    //$("#btnLoginwithFacebook").attr('style', 'display: none;');
    //$("#btnLoginwithGoogle").attr('style', 'display: none;');

    $('.error').removeClass('alert alert-danger').html('');

}
function showLoginForm() {
    $('#loginModal .registerBox').fadeOut('fast', function () {
        $('#loginModal .forgotBox').fadeOut('fast', function () {
            $('#loginModal .NewregisterBox').fadeOut('fast', function () {
                $('.loginBox').fadeIn('fast');
                $('.register-footer').fadeOut('fast', function () {
                    $('.login-footer').fadeIn('fast');
                });

                $('.modal-title').html('Login');

                //$('.social-login').fadeIn('fast');

                ////show facebook and google login buttons.
                //$("#btnLoginwithFacebook").attr('style', 'display: block;');
                //$("#btnLoginwithGoogle").attr('style', 'display: block;');

            });
        });
    });

    $('.error').removeClass('alert alert-danger').html('');
}

function showForgotForm() {
    $('.loginBox').fadeOut('fast', function () {
            $('.registerBox').fadeOut('fast', function () {
                $('.NewregisterBox').fadeOut('fast', function () {
                    $('.forgotBox').fadeIn('fast');
                    $('.login-footer').fadeOut('fast', function () {
                        $('.register-footer').fadeIn('fast');
                    });
                    $('.modal-title').html('Get Password');
                });
            });
        
    });
    $('.error').removeClass('alert alert-danger').html('');

    //$('.social-login').fadeOut('fast', function () {
    //});
}

function openLoginModal() {

    if (localStorage.RegisterLoginId == "" || localStorage.RegisterLoginId == undefined || localStorage.Name == "" || localStorage.Name == undefined) {
        showLoginForm();
        setTimeout(function () {
            $('#loginModal').modal('show');
        }, 230);
    }
    else {
        if (localStorage["Cart"] == "null" || localStorage["Cart"] == undefined) {
            //$scope.Cart = [];
            //$scope.ShopCount = 0;
        }
        else {
            //$scope.Cart = JSON.parse(localStorage["Cart"]);
            //$scope.ShopCount = $scope.Cart.length;
            location.href = "Services.aspx";
        }
        
        //var weekdays = "Today";
        //localStorage.setItem("weekdays", weekdays);
        //location.href = "ServiceCategories.aspx";
    }
}
function openRegisterModal() {
    showRegisterForm();
    setTimeout(function () {
        $('#loginModal').modal('show');
    }, 230);

}

//To Open Registration from on Register click
function openRegisterForm() {
    showRegisterForm();
    setTimeout(function () {
        $('#loginModal').modal('show');
    }, 230);

}

//function showDetailsForm() {


//    $('.DeatilsBox').fadeIn('fast');
//    $('.modal-title').html('Deatils');

//    //$('.error').removeClass('alert alert-danger').html('');
//}

//function openDetailsModal() {
//    showDetailsForm();
//    setTimeout(function () {
//        $('#DetailsModel').modal('show');
//    }, 230);

//}

function openForgotModal() {
    showForgotForm();
    setTimeout(function () {
        $('#loginModal').modal('show');
    }, 230);

}
function loginAjax() {
    /*   Remove this comments when moving to server
    $.post( "/login", function( data ) {
            if(data == 1){
                window.location.replace("/home");            
            } else {
                 shakeModal(); 
            }
        });
    */

    /*   Simulate error message from the server   */
    shakeModal();
}

function shakeModal() {
    $('#loginModal .modal-dialog').addClass('shake');
    $('.error').addClass('alert alert-danger').html("Invalid email/password combination");
    $('input[type="password"]').val('');
    setTimeout(function () {
        $('#loginModal .modal-dialog').removeClass('shake');
    }, 1000);
}

