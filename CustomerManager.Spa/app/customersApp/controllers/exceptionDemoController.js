(function () {

    var injectParams = ['$http', '$q', '$exceptionHandler', 'config'];

    var ExceptionDemoController = function ($http, $q, $exceptionHandler, config) {
        var vm = this;
        var internalSvrErrorUrl = config.apiBaseUrl + '/api/InternalServerError/ReturnError',
            badRequestUrl = config.apiBaseUrl + '/api/BadRequest/ReturnError';

        function logErrorResponse(resp) {
            $exceptionHandler(resp.data);
        }

        function printAndRethrow(exception) {
            console.log(exception);
            console.log('about to rethrow...');
            // "re-throw"
            return $q.reject(exception);
        }

        function printAndSwallow(exception) {
            console.log(exception);
            console.log('error swallowed');
        }

        vm.server500Unhandled = function() {
            return $http.get(internalSvrErrorUrl).catch(printAndRethrow).catch(logErrorResponse);

        }
        vm.server400Unhandled = function() {
            return $http.get(badRequestUrl).catch(printAndRethrow).catch(logErrorResponse);
        }
        vm.server500Handled = function() {
            return $http.get(internalSvrErrorUrl).catch(printAndSwallow);
        }
        vm.server400Handled = function() {
            return $http.get(badRequestUrl).catch(printAndSwallow);
        }
        vm.clientUnhandled = function() {
            throw new Error('Example browser error');
        }
        vm.clientHandled = function() {
            try {
                throw new Error('Example browser error');
            } catch (e) {
                printAndSwallow(e);
            } 
        }
    };

    ExceptionDemoController.$inject = injectParams;

    angular.module('customersApp').controller('ExceptionDemoController', ExceptionDemoController);

}());