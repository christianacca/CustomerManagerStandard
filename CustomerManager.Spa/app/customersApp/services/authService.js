(function () {

    var injectParams = ['$http', '$rootScope', 'config'];

    var authFactory = function ($http, $rootScope, config) {
        var serviceBase = config.apiBaseUrl + '/api/dataservice/',
            factory = {
                loginPath: '/login',
                user: {
                    id: '',
                    isAuthenticated: false,
                    roles: null
                }
            };

        factory.login = function (email, password) {
            return $http.post(serviceBase + 'login', { userLogin: { userName: email, password: password } }).then(
                function (results) {
                    var loggedIn = results.data.status;;
                    changeAuth(loggedIn, email);
                    return loggedIn;
                });
        };

        factory.logout = function () {
            return $http.post(serviceBase + 'logout').then(
                function (results) {
                    var loggedIn = !results.data.status;
                    changeAuth(loggedIn);
                    return loggedIn;
                });
        };

        factory.redirectToLogin = function () {
            $rootScope.$broadcast('redirectToLogin', null);
        };

        function changeAuth(loggedIn, userId) {
            factory.user.isAuthenticated = loggedIn;
            factory.user.id = userId;
            $rootScope.$broadcast('loginStatusChanged', loggedIn);
        }

        return factory;
    };

    authFactory.$inject = injectParams;

    angular.module('customersApp').factory('authService', authFactory);

}());

