(function () {

    var value = {
        useBreeze: true,
        apiBaseUrl: 'http://localhost/CustomerManager'
    };

    angular.module('customersApp').value('config', value);

}());