(function() {
    'use strict';

    angular
        .module('app')
        .controller('busRouteController', busRouteController);

    //Inject modules
    busRouteController.$inject = ['$rootScope', '$state', 'logger', 'busRouteService', 'DEBUG'];

    function busRouteController($rootScope, $state, logger, busRouteService, DEBUG) {
        var vm = this;
        vm.pageChanged = pageChanged;
        vm.deleteRouteById = deleteRouteById;

        activate();

        function activate() {
            vm.maxSize = 5;
            vm.pageSize = 10;
            vm.pageIndex = 1;

            busRouteService.getRoutes(vm.pageSize, vm.pageIndex)
                .then(function(data) {
                    vm.busRoutes = data.routes;
                    vm.count = data.count;
                }, function (reason) {
                    logger.logError('Get bus routes error!');
                });
        }

        function pageChanged() {
            busRouteService.getRoutes(vm.pageSize, vm.pageIndex)
               .then(function (data) {
                   vm.busRoutes = data.routes;
                   vm.count = data.count;
               }, function (reason) {
                   logger.logError('Get bus routes error!');
               });
        }

        function deleteRouteById(routId, idx) {
            if ($rootScope.authorised) {
                busRouteService.deleteRouteById(routId, idx).then(function(data) {
                    if (data.title === 'success') {
                        logger.logSuccess(data.msg);

                        vm.busRoutes.splice(idx, 1);
                        vm.count -= 1;
                    }
                });
            } else {
                logger.logError('User not login.');
                $state.go('login');
            }
        }
    }
})();