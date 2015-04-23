(function() {
    'use strict';

    angular
        .module('app')
        .controller('busesController', busesController);

    //Inject modules
    busesController.$inject = ['$rootScope', '$state', '$modal', 'logger', 'busService', 'DEBUG'];

    function busesController($rootScope, $state, $modal, logger, busService, DEBUG) {
        var vm = this;
        vm.pageChanged = pageChanged;
        vm.deleteBusById = deleteBusById;
        vm.open = open;

        activate();

        function activate() {
            vm.maxSize = 5;
            vm.pageSize = 10;
            vm.pageIndex = 1;

            busService.getBuses(vm.pageSize, vm.pageIndex)
                .then(function(data) {
                    vm.buses = data.buses;
                    vm.count = data.count;
                }, function (reason) {
                    logger.logError(angular.toJson(reason));
                });
        }

        function pageChanged() {
            busService.getBuses(vm.pageSize, vm.pageIndex)
               .then(function (data) {
                   vm.buses = data.buses;
                   vm.count = data.count;
               }, function (reason) {
                   logger.logError(angular.toJson(reason));
               });
        }

        function deleteBusById(busId, idx) {
            if ($rootScope.authorised) {
                busService.deleteBusById(busId, idx).then(function(data) {
                    if (data.title === 'success') {
                        logger.logSuccess(data.msg);

                        vm.buses.splice(idx, 1);
                        vm.count -= 1;
                    }
                });
            } else {
                logger.logError('User not login.');
                $state.go('login');
            }
        }

        function open(model, busId, idx) {
            model = !model ? 'add' : model;

            var modalInstance = $modal.open({
                templateUrl: '/app/views/bus/bus.html',
                controller: 'busController',
                controllerAs: 'vm',
                backdrop: false,
                resolve: {
                    busId: function () {
                        return model === 'add' ? null : busId;
                    },
                    model: function () {
                        return model;
                    }
                }
            });

            modalInstance.result.then(function (bus) {
                if (model === 'add') {
                    activate();
                }

                if (model === 'update') {
                    vm.buses[idx] = bus;
                }
            }, function () {
                logger.logInfo('Modal dismissed at: ' + new Date());
            });
        }
    }
})();