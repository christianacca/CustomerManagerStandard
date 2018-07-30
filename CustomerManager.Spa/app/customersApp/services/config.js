(function () {

    var value = {
        useBreeze: false,
        apiBaseUrl: 'http://localhost:58000'
    };

    angular.module('customersApp').value('config', value);

}());