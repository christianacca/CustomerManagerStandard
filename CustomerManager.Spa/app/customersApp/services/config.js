(function () {

    var value = {
        useBreeze: true,
        apiBaseUrl: 'http://localhost:58000'
    };

    angular.module('customersApp').value('config', value);

}());