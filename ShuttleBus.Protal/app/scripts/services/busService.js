(function() {
    'use strict';

    angular
        .module('services')
        .factory('busService', busService);

    busService.$inject = ['$http', 'logger', 'APIURL', 'DEBUG'];

    function busService($http, logger, APIURL, DEBUG) {
        var service = {
            getBuses: getBuses,
            add: add,
            update: update,
            getBusById: getBusById,
            deleteBusById: deleteBusById
        };

        return service;

        function getBuses(pageSize, pageIndex) {
            return $http.get(APIURL + 'buses?pageSize=' + pageSize + '&pageIndex=' + pageIndex).then(function(resp) {
                return resp.data;
            });
        }

        function add(bus) {
            return $http.post(APIURL + 'buses', angular.toJson(bus), {
                headers: {
                    'Content-Type':'application/json'
                }
            }).then(function (resp) {
                return resp.data;
            });
        }

        function update(busId, bus) {
            return $http.put(APIURL + 'buses/' + busId, angular.toJson(bus), {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (resp) {
                return resp.data;
            });
        }

        function getBusById(busId) {
            return $http.get(APIURL + 'buses/' + busId).then(function (resp) {
                return resp.data;
            });
        }

        function deleteBusById(busId) {
            return $http.delete(APIURL + 'buses/' + busId).then(function (resp) {
                return resp.data;
            });
        }
    }
})();