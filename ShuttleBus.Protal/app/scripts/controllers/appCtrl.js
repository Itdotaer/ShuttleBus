(function () {
    'use strict';

    angular
        .module('app')
        .controller('appController', appController);

    //Inject modules
    appController.$inject = ['$scope', 'logger'];

    function appController($scope, logger) {
        $scope.appName = "Blog";
    }
})();