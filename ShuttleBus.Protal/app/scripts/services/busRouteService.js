(function() {
    'use strict';

    angular
        .module('services')
        .factory('busRouteService', busRouteService);

    busRouteService.$inject = ['$http','logger', 'APIURL', 'DEBUG'];

    function busRouteService($http, logger, APIURL, DEBUG) {
        var service = {
            getRoutes: getRoutes,
            deleteRouteById: deleteRouteById
        };

        return service;

        function getRoutes(pageSize, pageIndex) {
            return $http.get(APIURL + 'busRoutes?pageSize=' + pageSize + '&pageIndex=' + pageIndex).then(function(resp) {
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