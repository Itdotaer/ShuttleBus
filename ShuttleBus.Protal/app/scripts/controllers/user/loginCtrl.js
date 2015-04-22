(function() {
    'use strict';

    angular
        .module('app')
        .controller('loginController', loginController);

    //Inject modules
    loginController.$inject = ['$scope', '$rootScope', '$cookies', '$state', 'logger', 'userService','DEBUG'];

    function loginController($scope, $rootScope, $cookies, $state, logger, userService,DEBUG) {
        var vm = this;
        vm.login = login;

        activate();

        function activate() {
            vm.rememberedMeChecked = false;
            vm.userInfo = { userName: '', password: '', rememberedMe: '', isMd5Encorpy: false };

            var userInfo = $cookies.get('userInfo');
            if (userInfo) {
                vm.userInfo = JSON.parse(userInfo);
            }

            if (DEBUG) {
                logger.logInfo("Get remembered userInfo.");
            }

            //Watch password changed
            $scope.$watch('vm.userInfo.password', function (newPwd, oldPwd) {
                if (newPwd != oldPwd) {
                    vm.userInfo.isMd5Encorpy = false;
                }
            });
        }

        function login() {
            if (!vm.userInfo.userName || !vm.userInfo.password) {
                logger.logError("UserName or password is null.");
            } else {
                if (DEBUG) {
                    logger.logInfo("Go into request user login service.");
                }

                if (vm.userInfo.rememberedMe === true) {
                    if (vm.userInfo.isMd5Encorpy === false) {
                        //Md5 Encorpy
                        vm.userInfo.password = userService.getMd5(vm.userInfo.password);
                        vm.userInfo.isMd5Encorpy = true;
                        $cookies.put('userInfo', angular.toJson(vm.userInfo));

                        if (DEBUG) {
                            logger.logInfo("Remembered");
                        }
                    } else {
                        $cookies.put('userInfo', angular.toJson(vm.userInfo));
                    }
                } else {
                    $cookies.remove('userInfo');
                    if (DEBUG) {
                        logger.logInfo("Remove user info.");
                    }
                }

                //Login
                userService.login(vm.userInfo).then(function (user) {
                    if (user != 'null') {
                        if (DEBUG) {
                            console.log('loged in user', user);
                        }
                        vm.userInfo.isMd5Encorpy = true;
                        $cookies.put('loginUser', angular.toJson(user));
                        logger.logSuccess(user.userName + ' Logined In.');
                        $state.go('index');
                    } else {
                        logger.logError("UserName or password is incorrect.");
                    }
                }, function (reason) {
                    logger.logError("Post to server Error.");
                });
            }
        }        
    }
})();