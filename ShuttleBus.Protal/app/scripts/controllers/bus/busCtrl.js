(function() {
    'use strict';

    angular
        .module('app')
        .controller('busController', busController);

    //Inject modules
    busController.$inject = ['$rootScope', '$state', '$modal', 'logger', 'busService', '$modalInstance', 'busId', 'model', 'DEBUG'];

    function busController($rootScope, $state, $modal, logger, busService, $modalInstance, busId, model, DEBUG) {
        var vm = this;
        vm.ok = ok;
        vm.cancel = cancel;
        vm.newBus = newBus;

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
                vm.busId = busId;

                if (vm.busId) {
                    busService.getBusById(vm.busId).then(function (bus) {
                        vm.bus = bus;
                    }, function (reason) {
                        logger.logError(reason);
                    });
                } else {
                    logger.logError('No bus id.Model:' + vm.model);
                }
            } else {
                //Add model
                vm.model = 'add';

                vm.bus = newBus();
            }
        }

        function newBus() {
            var data = {
                "busName": "",
                "busDes": "",
                "busNumber": "",
                "busOwner": "",
                "busOwnerNumber": "",
                "busStatus": "",
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
                busService.add(vm.bus).then(function(bus) {
                    $modalInstance.close(bus);
                }, function(reason) {
                    logger.logError(angular.toJson(reason));
                    console.log(angular.toJson(reason));
                });
            }

            if (vm.model === 'update') {
                vm.bus.lastUpdatedBy = $rootScope.userInfo._id;
                busService.update(vm.busId, vm.bus).then(function (bus) {
                    $modalInstance.close(bus);
                }, function (reason) {
                    logger.logError(angular.toJson(reason));
                    console.log(angular.toJson(reason));
                });
            }
        };

        function cancel() {
            $modalInstance.dismiss('cancel');
        };
    }
})();