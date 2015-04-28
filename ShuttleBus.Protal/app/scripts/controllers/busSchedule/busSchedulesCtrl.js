(function() {
    'use strict';

    angular
        .module('app')
        .controller('busSchedulesController', busSchedulesController);

    //Inject modules
    busSchedulesController.$inject = ['$rootScope', '$state', '$modal', 'logger', 'busScheduleService', 'DEBUG'];

    function busSchedulesController($rootScope, $state, $modal, logger, busScheduleService, DEBUG) {
        var vm = this;
        vm.pageChanged = pageChanged;
        vm.deleteById = deleteById;
        vm.open = open;
        vm.activate = activate;
        vm.clickSearch = clickSearch;

        activate();

        function activate() {
            vm.maxSize = 5;
            vm.pageSize = 10;
            vm.pageIndex = 1;
            vm.search = false;
            vm.schedules = [];

            busScheduleService.getList(vm.pageSize, vm.pageIndex)
                .then(function(data) {
                    vm.schedules = data.schedules;
                    vm.count = data.count;
                }, function (reason) {
                    logger.logError(angular.toJson(reason));
                });
        }

        function pageChanged() {
            busScheduleService.getList(vm.pageSize, vm.pageIndex)
               .then(function (data) {
                   vm.schedules = data.schedules;
                   vm.count = data.count;
               }, function (reason) {
                   logger.logError(angular.toJson(reason));
               });
        }

        function deleteById(id, idx) {
            if ($rootScope.authorised) {
                busScheduleService.deleteById(id, idx).then(function (data) {
                    if (data.title === 'success') {
                        logger.logSuccess(data.msg);

                        vm.schedules.splice(idx, 1);
                        vm.count -= 1;
                    }
                });
            } else {
                logger.logError('User not login.');
                $state.go('login');
            }
        }

        function open(model, id, idx) {
            model = !model ? 'add' : model;
            if (!$rootScope.userInfo) {
                logger.logWarning('User should login.');
                $state.go('login');
                return;
            }

            var modalInstance = $modal.open({
                templateUrl: '/app/views/busSchedule/busSchedule.html',
                controller: 'busScheduleController',
                controllerAs: 'vm',
                //backdrop: false,
                resolve: {
                    id: function () {
                        return model === 'add' ? null : id;
                    },
                    model: function () {
                        return model;
                    }
                }
            });

            modalInstance.result.then(function (schedule) {
                if (model === 'add') {
                    activate();
                }

                if (model === 'update') {
                    vm.schedules[idx] = schedule;
                }
            }, function () {
                logger.logInfo('Modal dismissed at: ' + new Date());
            });
        }

        function clickSearch(searchFlag) {
            vm.search = searchFlag;
        }
    }
})();