(function () {

    var injectParams = ['$http', '$q', '$exceptionHandler', 'config'];

    var ExceptionDemoController = function ($http, $q, $exceptionHandler, config) {
        var vm = this;
        var internalSvrErrorUrl = config.apiBaseUrl + '/api/InternalServerError/ReturnError',
            internalSvrThrownErrorUrl = config.apiBaseUrl + '/api/InternalServerError/ThrowError',
            controllerCtorErrUrl = config.apiBaseUrl + '/api/ControllerConstructorError/ReturnError',
            badRequestUrl = config.apiBaseUrl + '/api/BadRequest/ReturnError';

        function printAndReject(exception) {
            console.log(exception);
            console.log('about to reject promise...');
            // "re-throw"
            return $q.reject(exception);
        }

        function printAndSwallow(exception) {
            console.log(exception);
            console.log('error swallowed');
        }

        vm.api500Unhandled = function () {
            // app insights dotnet sdk records:
            // * a request failure
            // app insights JS sdk records:
            // * an ajax depedendecy failure
            // * an exception (via $exceptionHandler decorated by angular-cc-appinsights)
            return $http.get(internalSvrErrorUrl).catch(printAndReject).catch($exceptionHandler);
        }
        vm.apiExUnhandled = function () {
            // app insights dotnet sdk records:
            // * an exception
            // * a request failure
            // app insights JS sdk records:
            // * an ajax depedendecy failure
            // * an exception (via $exceptionHandler decorated by angular-cc-appinsights)
            return $http.get(internalSvrThrownErrorUrl).catch(printAndReject).catch($exceptionHandler);
        }
        vm.apiCtorExUnhandled = function () {
            // same as apiExUnhandled
            return $http.get(controllerCtorErrUrl).catch(printAndReject).catch($exceptionHandler);
        }
        vm.api400Unhandled = function () {
            // same as api500Unhandled
            return $http.get(badRequestUrl).catch(printAndReject).catch($exceptionHandler);
        }
        vm.api500Handled = function () {
            // app insights dotnet sdk records:
            // * a request failure
            return $http.get(internalSvrErrorUrl).catch(printAndSwallow);
        }
        vm.api400Handled = function () {
            // app insights dotnet sdk records:
            // * a request failure
            return $http.get(badRequestUrl).catch(printAndSwallow);
        }
        vm.clientUnhandled = function () {
            // app insights JS sdk records:
            // * an exception (via $exceptionHandler decorated by angular-cc-appinsights)
            throw new Error('Example browser error');
        }
        vm.clientHandled = function () {
            // nothing reported to app insights
            try {
                throw new Error('Example browser error');
            } catch (e) {
                printAndSwallow(e);
            } 
        }
        vm.promiseChainExHandled = function () {
            // note: angular 1.6+ the error will NOT be sent to $errorHandler (this is the desired behaviour)
            // note: angular <1.6 the error will be sent to $errorHandler (this is NOT the desired behaviour)
            $q.when('').then(function() {
                throw new Error('Error thrown in promise chain');
            }).catch(printAndSwallow);
        }
    };

    ExceptionDemoController.$inject = injectParams;

    angular.module('customersApp').controller('ExceptionDemoController', ExceptionDemoController);

}());