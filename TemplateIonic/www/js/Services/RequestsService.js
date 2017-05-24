(function () {

    angular.module('starter')
    .service('RequestsService', ['$http', '$q', '$ionicLoading', RequestsService]);

    function RequestsService($http, $q, $ionicLoading) {

        var base_url = 'http://124.123.33.8/';

        function register(device_token) {

            var deferred = $q.defer();
            $ionicLoading.show();

            $http.post(base_url + '/register', { 'device_token': device_token })
                .success(function (response) {

                    $ionicLoading.hide();
                    deferred.resolve(response);

                })
                .error(function (data) {
                    deferred.reject();
                });


            return deferred.promise;

        };


        return {
            register: register
        };
    }
})();