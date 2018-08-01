angular.module("ccExceptionPoliciesModule", [])
    .factory("ccExceptionPolicies", ["$q", "$exceptionHandler", function($q, $exceptionHandler) {

        function getBadRequestDetails(ex) {
            if (is$HttpResponse(ex)) {
                ex = httpFailureFormatter(ex);
            }

            return ex == null || ex.httpStatus !== 400 ? undefined : ex.httpData && ex.httpData.modelState;
        }

        var httpFailureFormatter = (function() {

            // note: opinionated at the moment - assumes ASP.NET Web Api backend
            // todo: make building of message extensible


            function buildExceptionMessage($httpFailureResponse) {
                if (typeof $httpFailureResponse.data === "string" && $httpFailureResponse.data !== "") {
                    return $httpFailureResponse.data;
                } else if (angular.isObject($httpFailureResponse.data)) {
                    return $httpFailureResponse.data.exceptionMessage || $httpFailureResponse.data.message || "";
                } else {
                    return $httpFailureResponse.statusText;
                }
            }


            function $httpFailureFormatter($httpFailureResponse) {
                if (!is$HttpResponse($httpFailureResponse)) return $httpFailureResponse;

                var ex = new Error();
                ex.isExpected = $httpFailureResponse.status < 500;
                // note: I wanted to be differentiate between cancellation and network error;
                //       network error should NOT be silent ie should be notified to the user
                if (isHttpCancelOrNetworkError($httpFailureResponse)) {
                    // cancellation shouldn't be consider an error by default and shouldn't be logged or notified to user
                    ex.isError = false;
                    ex.isSilent = true;
                    ex.isHttpCancelOrNetworkError = true;
                }
                ex.httpStatus = $httpFailureResponse.status;
                ex.httpStatusText = $httpFailureResponse.statusText;
                ex.httpData = $httpFailureResponse.data;
                ex.message = buildExceptionMessage($httpFailureResponse);
                if ($httpFailureResponse.statusText) {
                    ex.name = $httpFailureResponse.statusText;
                }
                ex.httpRequest = {
                    method: $httpFailureResponse.config.method,
                    url: $httpFailureResponse.config.url,
                    params: $httpFailureResponse.config.params
                };
                return ex;
            }

            return $httpFailureFormatter;
        })();

        function is$HttpResponse(response) {
            return angular.isObject(response)
                && ("status" in response) && ("statusText" in response) && ("config" in response);
        }

        function isHttpCancelOrNetworkError(response) {
            // note: according to the http spec network unavailable error should be returned as a status of 0
            // note: in angular there is no (easy?) way to distinguish between a $http request being cancelled and an error because
            // of network being unavailable :-(

            var CANCEL_OR_NETWORK_ERROR_HTTP_STATUS = angular.version.minor > 3 ? -1 : 0;
            return angular.isObject(response) && response.status === CANCEL_OR_NETWORK_ERROR_HTTP_STATUS;
        }

        function logExceptionAndReject(exception) {
            if (exception == null) return null;

            //an exception has reached at point where if it hasn't yet been classified that it is NOT an error
            //then we can only assume that it must be
            if (exception.isError === false) {
                if (exception.isSilent !== true) {
                    $exceptionHandler(exception, "notification");
                }
            } else {
                if (typeof exception === "object") {
                    exception.isError = true;
                }
                $exceptionHandler(exception, "error");
            }

            //we need to "rethrow" just in case this function is not being used at the *end* of a promise chain
            //otherwise we could end up causing the exception to be treated as being recovered and allowing downstream
            //promise callbacks to fire
            return $q.reject(exception);
        }


        function formatHttpFailureAndReject($httpFailureResponse) {
            // wrap and "rethrow"
            return $q.reject(httpFailureFormatter($httpFailureResponse));
        }

        function decorateAsyncFnWithExPolicy(asyncFn, context) {
            return function exPolicyPromiseChainDecorator() {
                var promise = asyncFn.apply(context, arguments);
                return promise.catch(service.promiseFinExPolicy);
            };
        }

        var service = {
            decorateAsyncFnWithExPolicy: decorateAsyncFnWithExPolicy,
            getBadRequestDetails: getBadRequestDetails,
            httpFailureFormatter: httpFailureFormatter,
            is$HttpResponse: is$HttpResponse,
            isHttpCancelOrNetworkError: isHttpCancelOrNetworkError,
            // set default policies
            httpExPolicy: formatHttpFailureAndReject,
            promiseFinExPolicy: logExceptionAndReject
        };
        return service;
    }])
    .provider("ccExPoliciyHttpInterceptor", [function () {
        "use strict";

        // do NOT apply httpExPolicy by default to $http failures; 
        // individual requests can elect to have httpExPolicy applied to their failures by having a config with 
        // 'ccApplyHttpExPolicy' set to true or set to a function that returns true
        var httpExPolicySelector = function (/*rejection*/) {
            return false;
        };

        function interceptorCtor($q, exPolicies) {

            function shouldApplyHttpExPolicy(rejection) {
                if (rejection.config.ccApplyHttpExPolicy === undefined) return httpExPolicySelector(rejection);

                if (angular.isFunction(rejection.config.ccApplyHttpExPolicy)) {
                    return rejection.config.ccApplyHttpExPolicy(rejection);
                } else {
                    return !!rejection.config.ccApplyHttpExPolicy;
                }
            }

            function maybeApplyHttpExPolicy(rejection) {
                if (shouldApplyHttpExPolicy(rejection)) {
                    return exPolicies.httpExPolicy(rejection);
                } else {
                    return $q.reject(rejection);
                }
            }

            return {
                responseError: maybeApplyHttpExPolicy
            };
        }


        return {
            setHttpExPolicySelector: function (fn) {
                httpExPolicySelector = fn;
            },
            $get: ["$q", "ccExceptionPolicies", interceptorCtor]
        };

    }])
    .config(["$httpProvider", function ($httpProvider) {
        "use strict";
        $httpProvider.interceptors.push("ccExPoliciyHttpInterceptor");
    }]);