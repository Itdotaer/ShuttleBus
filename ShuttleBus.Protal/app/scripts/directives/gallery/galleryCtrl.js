(function() {
    'use strict';

    angular
        .module('blog.gallery')
        .controller('galleryController', galleryController);

    //Inject modules
    galleryController.$inject = ['$scope', '$state', 'logger', 'galleryService','DEBUG'];

    function galleryController($scope, $state, logger, galleryService, DEBUG) {
        var vm = this;

        activate();

        function activate() {
            vm.galleries = galleryService.getAllGalleries();
        }
    }
})();