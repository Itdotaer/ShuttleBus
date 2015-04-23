(function() {
    'use strict';

    angular
        .module('services')
        .factory('busRouteService', busRouteService);

    busRouteService.$inject = ['$http','logger', 'APIURL', 'DEBUG'];

    function busRouteService($http, logger, APIURL, DEBUG) {
        var service = {
            getRoutes: getRoutes,
            add: add,
            update: update,
            getRouteById: getRouteById,
            deleteRouteById: deleteRouteById
        };

        return service;

        function getRoutes(pageSize, pageIndex) {
            return $http.get(APIURL + 'busRoutes?pageSize=' + pageSize + '&pageIndex=' + pageIndex).then(function(resp) {
                return resp.data;
            });
        }

        function add(busRoute) {
            return $http.post(APIURL + 'busRoutes', angular.toJson(busRoute), {
                headers: {
                    'Content-Type':'application/json'
                }
            }).then(function (resp) {
                return resp.data;
            });
        }

        function update(routeId, busRoute) {
            return $http.put(APIURL + 'busRoutes/' + routeId, angular.toJson(busRoute), {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (resp) {
                return resp.data;
            });
        }

        function getRouteById(routeId) {
            return $http.get(APIURL + 'busRoutes/' + routeId).then(function(resp) {
                return resp.data;
            });
        }

        function deleteRouteById(routeId) {
            return $http.delete(APIURL + 'busRoutes/' + routeId).then(function(resp) {
                return resp.data;
            });
        }
    }
})();