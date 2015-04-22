(function() {
    'use strict';

    angular
        .module('services')
        .factory('mailService', mailService);

    mailService.$inject = ['$http', 'logger', 'APIURL', 'DEBUG'];

    function mailService($http, logger, APIURL, DEBUG) {
        var service = {
            sendMail: sendMail
        };

        return service;

        function sendMail(mail) {
            return $http.post(APIURL + '/Mails', JSON.stringify(mail), {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function(resp) {
                return resp.data;
            });
        }
    }
})();