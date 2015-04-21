(function() {
    'use strict';

    angular
        .module('app')
        .controller('editUserInfoController', editUserInfoController);

    //Inject modules
    editUserInfoController.$inject = ['$scope', '$rootScope', '$cookies', '$state', 'logger', 'userService', 'DEBUG'];

    function editUserInfoController($scope, $rootScope, $cookies, $state, logger, userService, DEBUG) {
        var vm = this;
        vm.cancel = cancel;
        vm.update = update;

        activate();

        function activate() {
            vm.userInfo = $rootScope.userInfo;
        }

        function cancel() {
            $state.go('userInfo');
        }

        function update() {
            userService.update(vm.userInfo).then(function (user) {
                console.log('fronted user', user);
                if (user != 'null') {
                    $cookies.put('loginUser', angular.toJson(user));
                    $state.go('userInfo');
                } else {
                    logger.logError('No UserInfo update.');
                }
            }, function(err) {
                logger.logError(err);
            });
        }
    }
})();