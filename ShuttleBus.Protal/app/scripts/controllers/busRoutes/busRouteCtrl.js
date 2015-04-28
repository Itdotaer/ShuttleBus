(function() {
    'use strict';

    angular
        .module('app')
        .controller('busRouteController', busRouteController);

    //Inject modules
    busRouteController.$inject = ['$rootScope', '$state', '$modal', 'logger', 'busRouteService', '$modalInstance', 'routeId', 'model','DEBUG'];

    function busRouteController($rootScope, $state, $modal, logger, busRouteService, $modalInstance, routeId, model, DEBUG) {
        var vm = this;
        vm.ok = ok;
        vm.cancel = cancel;
        vm.newBusRoute = newBusRoute;

        activate();

        function activate() {
            vm.model = !model ? 'add' : model;
            if (vm.model === 'detail') {
                vm.okBtn = 'OK';
            } else {
                vm.okBtn = 'Save';
            }

            vm.modalTitle = angular.uppercase(vm.model);

            if (vm.model === 'detail' || vm.model === 'update') {
                vm.routeId = routeId;

                if (vm.routeId) {
                    busRouteService.getRouteById(vm.routeId).then(function (busRoute) {
                        vm.busRoute = busRoute;
                    }, function (reason) {
                        logger.logError(reason);
                    });
                } else {
                    logger.logError('No route id.Model:' + vm.model);
                }
            } else {
                //Add model
                vm.model = 'add';

                vm.busRoute = newBusRoute();
            }
        }

        function newBusRoute() {
            var data = {
                "routeName": "",
                "routeDes": "",
                "routeFrom": "",
                "routeTo": "",
                "createdBy": $rootScope.userInfo._id,
                "lastUpdatedBy": $rootScope.userInfo._id
            }

           return angular.copy(data);
        }

        function ok() {
            if (vm.model === 'detail') {
                $modalInstance.close();
                return;
            }

            if (vm.model === 'add') {
                busRouteService.add(vm.busRoute).then(function(route) {
                    $modalInstance.close(route);
                }, function(reason) {
                    logger.logError(angular.toJson(reason.data.message));
                    console.log(angular.toJson(reason));
                });
            }

            if (vm.model === 'update') {
                vm.busRoute.lastUpdatedBy = $rootScope.userInfo._id;
                busRouteService.update(vm.routeId, vm.busRoute).then(function (route) {
                    $modalInstance.close(route);
                }, function (reason) {
                    logger.logError(angular.toJson(reason.data.message));
                    console.log(angular.toJson(reason));
                });
            }
        };

        function cancel() {
            $modalInstance.dismiss('cancel');
        };
    }
})();