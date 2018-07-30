(function () {

    var app = angular.module('customersApp',
        ['ngRoute', 'ngAnimate', 'wc.directives', 'ui.bootstrap', 'breeze.angular', 'cc-appinsights']);

    app.config(['$routeProvider', function ($routeProvider) {
        var viewBase = 'app/customersApp/views/';

        $routeProvider
            .when('/customers', {
                controller: 'CustomersController',
                templateUrl: viewBase + 'customers/customers.html',
                controllerAs: 'vm'
            })
            .when('/customerorders/:customerId', {
                controller: 'CustomerOrdersController',
                templateUrl: viewBase + 'customers/customerOrders.html',
                controllerAs: 'vm'
            })
            .when('/customeredit/:customerId', {
                controller: 'CustomerEditController',
                templateUrl: viewBase + 'customers/customerEdit.html',
                controllerAs: 'vm',
                secure: true //This route requires an authenticated user
            })
            .when('/orders', {
                controller: 'OrdersController',
                templateUrl: viewBase + 'orders/orders.html',
                controllerAs: 'vm'
            })
            .when('/about', {
                controller: 'AboutController',
                templateUrl: viewBase + 'about.html',
                controllerAs: 'vm'
            })
            .when('/login/:redirect*?', {
                controller: 'LoginController',
                templateUrl: viewBase + 'login.html',
                controllerAs: 'vm'
            })
            .otherwise({ redirectTo: '/customers' });

    }])
    .config(['ccAppInsightsProvider', function (ccAppInsightsProvider) {
        ccAppInsightsProvider.configure();
        // below is an example of registering an angular service/factory as a telemetry initializer
        // for more options see https://github.com/christianacca/angular-cc-appinsights/blob/master/api-reference.md
//        ccAppInsightsProvider.configure({
//            telemetryInitializers: ['sessionIdTelemetryInitializer']
//        });
    }]);

    app.run(['$rootScope', '$location', 'authService', 'ccAppInsights',
        function ($rootScope, $location, authService, ccAppInsights) {
            
            //Client-side security. Server-side framework MUST add it's 
            //own security as well since client-based security is easily hacked
            $rootScope.$on("$routeChangeStart", function (event, next, current) {
                if (next && next.$$route && next.$$route.secure) {
                    if (!authService.user.isAuthenticated) {
                        $rootScope.$evalAsync(function () {
                            authService.redirectToLogin();
                        });
                    }
                }
            });

            $rootScope.$on('loginStatusChanged', function() {
                if (authService.user.isAuthenticated) {
                    var storeInCookie = true;
                    ccAppInsights.service.setAuthenticatedUserContext(authService.user.id, null, storeInCookie);
                } else {
                    ccAppInsights.service.clearAuthenticatedUserContext();
                }
            });

        }]);

}());

