(function() {
    'use strict';

    angular
        .module('services')
        .factory('busScheduleService', busScheduleService);

    busScheduleService.$inject = ['$http', 'logger', 'APIURL', 'DEBUG'];

    function busScheduleService($http, logger, APIURL, DEBUG) {
        var service = {
            getList: getList,
            add: add,
            update: update,
            getById: getById,
            deleteById: deleteById
        };

        return service;

        function getList(pageSize, pageIndex) {
            return $http.get(APIURL + 'busSchedules?pageSize=' + pageSize + '&pageIndex=' + pageIndex).then(function(resp) {
                return resp.data;
            });
        }

        function add(dataModel) {
            return $http.post(APIURL + 'busSchedules', angular.toJson(dataModel), {
                headers: {
                    'Content-Type':'application/json'
                }
            }).then(function (resp) {
                return resp.data;
            });
        }

        function update(id, dataModel) {
            return $http.put(APIURL + 'busSchedules/' + id, angular.toJson(dataModel), {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (resp) {
                return resp.data;
            });
        }

        function getById(id) {
            return $http.get(APIURL + 'busSchedules/' + id).then(function (resp) {
                return resp.data;
            });
        }

        function deleteById(id) {
            return $http.delete(APIURL + 'busSchedules/' + id).then(function (resp) {
                return resp.data;
            });
        }
    }
})();