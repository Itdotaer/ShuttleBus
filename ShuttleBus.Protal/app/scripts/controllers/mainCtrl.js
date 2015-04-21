(function() {
    'use strict';

    angular
        .module('app')
        .controller('mainController', mainController);

    //Inject modules
    mainController.$inject = ['logger', 'DEBUG'];

    function mainController(logger, DEBUG) {
        var vm = this;

        activate();

        function activate() {
        }
    }
})();