(function() {
    'use strict';

    angular
        .module('app')
        .controller('busRoutesController', busRoutesController);

    //Inject modules
    busRoutesController.$inject = ['$rootScope', '$state', '$modal', 'logger', 'busRouteService', 'DEBUG'];

    function busRoutesController($rootScope, $state, $modal, logger, busRouteService, DEBUG) {
        var vm = this;
        vm.pageChanged = pageChanged;
        vm.deleteRouteById = deleteRouteById;
        vm.open = open;

        activate();

        function activate() {
            vm.maxSize = 5;
            vm.pageSize = 1;
            vm.pageIndex = 1;

            busRouteService.getRoutes(vm.pageSize, vm.pageIndex)
                .then(function(data) {
                    vm.busRoutes = data.routes;
                    vm.count = data.count;
                }, function (reason) {
                    logger.logError(angular.toJson(reason));
                });
        }

        function pageChanged() {
            busRouteService.getRoutes(vm.pageSize, vm.pageIndex)
               .then(function (data) {
                   vm.busRoutes = data.routes;
                   vm.count = data.count;
               }, function (reason) {
                   logger.logError(angular.toJson(reason));
               });
        }

        function deleteRouteById(routeId, idx) {
            if ($rootScope.authorised) {
                busRouteService.deleteRouteById(routeId, idx).then(function(data) {
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

        function open(model, routeId, idx) {
            model = !model ? 'add' : model;

            var modalInstance = $modal.open({
                templateUrl: '/app/views/busRoute/busRoute.html',
                controller: 'busRouteController',
                controllerAs: 'vm',
                backdrop: false,
                resolve: {
                    routeId: function () {
                        return model === 'add' ? null : routeId;
                    },
                    model: function () {
                        return model;
                    }
                }
            });

            modalInstance.result.then(function (route) {
                if (model === 'add') {
                    activate();
                }

                if (model === 'update') {
                    vm.busRoutes[idx] = route;
                }
            }, function () {
                logger.logInfo('Modal dismissed at: ' + new Date());
            });
        }
    }
})();