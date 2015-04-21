(function() {
    'use strict';

    angular
        .module('blog.gallery')
        .directive('blogGallery', blogGallery);

    //Inject modules
    blogGallery.$inject = [];

    function blogGallery() {
        var directive = {
            restrict: 'E',
            templateUrl: '/app/scripts/directives/gallery/gallery.html',
            controller: 'galleryController',
            controllerAs: 'galleryCtrl'
        };

        return directive;
    }
})();