(function() {
    'use strict';

    angular
        .module('services')
        .factory('galleryService', galleryService);

    galleryService.$inject = ['$http', '$cookies', 'logger', 'APIURL', 'DEBUG'];

    function galleryService($http, $cookies, logger, APIURL, DEBUG) {
        var localGalleries = [];

        var service = {
            getAllGalleries: getAllGalleries
        };

        return service;

        function getAllGalleries() {
            localGalleries = [
                { id: 0, imgSrc: '/app/images/home-bg.jpg', title: 'title1', des: 'Learn and live.', alt: 'pic1' },
                { id: 1, imgSrc: '/app/images/post-bg.jpg', title: 'title2', des: 'Happy and travel.', alt: 'pic2' },
                { id: 2, imgSrc: '/app/images/contact-bg.jpg', title: 'title3', des: 'Act and see.', alt: 'pic3' }
            ];

            return localGalleries;
        }
    }
})();