(function() {
    'use strict';

    angular
        .module('app')
        .controller('logoutController', logoutController);

    //Inject modules
    logoutController.$inject = ['$cookies', '$state', 'logger', 'DEBUG'];

    function logoutController($cookies, $state, logger, DEBUG) {
        var vm = this;
        
        activate();

        function activate() {
            $cookies.remove('loginUser');
            $state.go('login');
        }     
    }
})();