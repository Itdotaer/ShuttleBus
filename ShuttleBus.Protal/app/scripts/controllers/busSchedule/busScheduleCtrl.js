(function() {
    'use strict';

    angular
        .module('app')
        .controller('busScheduleController', busScheduleController);

    //Inject modules
    busScheduleController.$inject = ['$rootScope', '$state', '$modal', 'logger', 'busScheduleService', 'busService', '$modalInstance', 'id', 'model', 'DEBUG'];

    function busScheduleController($rootScope, $state, $modal, logger, busScheduleService, busService, $modalInstance, id, model, DEBUG) {
        var vm = this;
        vm.ok = ok;
        vm.cancel = cancel;
        vm.newSchedule = newSchedule;
        vm.loadBusSelection = loadBusSelection;

        activate();

        function activate() {
            vm.usefulBuses = [];
            vm.model = !model ? 'add' : model;
            if (vm.model === 'detail') {
                vm.okBtn = 'OK';
            } else {
                vm.okBtn = 'Save';
            }

            vm.modalTitle = angular.uppercase(vm.model);

            if (vm.model === 'detail' || vm.model === 'update') {
                vm.id = id;

                if (vm.id) {
                    busScheduleService.getById(vm.id).then(function (schedule) {
                        vm.schedule = schedule;
                        vm.usefulBuses.push(schedule.bus);
                        vm.schedule.bus = vm.schedule.bus._id;
                    }, function (reason) {
                        logger.logError(reason);
                    });
                } else {
                    logger.logError('No bus id.Model:' + vm.model);
                }
            } else {
                //Add model
                vm.model = 'add';

                vm.schedule = newSchedule();
            }

            loadBusSelection();
        }

        function newSchedule() {
            var data = {
                "scheduleName": "",
                "scheduleDes": "",
                "scheduleTime": "",
                "bus": "",
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
                busScheduleService.add(vm.schedule).then(function (schedule) {
                    $modalInstance.close(schedule);
                }, function(reason) {
                    logger.logError(angular.toJson(reason));
                    console.log(angular.toJson(reason));
                });
            }

            if (vm.model === 'update') {
                vm.schedule.lastUpdatedBy = $rootScope.userInfo._id;
                busScheduleService.update(vm.id, vm.schedule).then(function (schedule) {
                    $modalInstance.close(schedule);
                }, function (reason) {
                    logger.logError(angular.toJson(reason));
                    console.log(angular.toJson(reason));
                });
            }
        };

        function cancel() {
            $modalInstance.dismiss('cancel');
        };

        function loadBusSelection() {
            busService.getUsefulBuses().then(function (cbBuses) {
                angular.forEach(cbBuses, function(bus) {
                    vm.usefulBuses.push(bus);
                });
            }, function (reason) {
                logger.logError(angular.toJson(reason));
            });
        }
    }
})();