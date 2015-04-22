(function() {
    'use strict';

    angular
        .module('services')
        .factory('postService', postService);

    postService.$inject = ['$http', 'logger', 'APIURL', 'DEBUG'];

    function postService($http, logger, APIURL, DEBUG) {
        var service = {
            addPost: addPost,
            getPostById: getPostById,
            getAllPosts: getAllPosts,
            getPosts: getPosts,
            updatePost: updatePost,
            deletePostById: deletePostById
    };    

        return service;

        function addPost(loginUser, post) {
            var postData = {
                Id: -1,
                Title: post.title,
                Description: post.description,
                Content: post.content,
                Pv: 0,
                PublishedDate:null,
                PublishedBy: loginUser.Id,
                CreatedDate: null,
                CreatedBy: loginUser.Id,
                LastUpdatedDate: null,
                LastUpdatedBy: loginUser.Id,
                IsDeleted: false
            };

            if (DEBUG) {
                console.log('loginUser', loginUser);
                console.log('postData', postData);
            }

            return $http.post(APIURL + '/Posts', JSON.stringify(postData), {
                headers: {
                    'Content-Type':'application/json'
                }
            }).then(function(resp) {
                return resp.data;
            });
        }

        function getPostById(postId) {
            return $http.get(APIURL + '/Posts/' + postId, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function(resp) {
                return resp.data;
            });
        }

        function getAllPosts() {
            return $http.get(APIURL + '/Posts', {
                headers: {
                    'Content-Type':'application/json'
                }
            }).then(function(resp) {
                return resp.data;
            });
        }

        function getPosts(pageSize, pageIndex) {
            return $http.get(APIURL + '/Posts/GetPosts?pageSize=' + pageSize + '&&pageIndex=' + pageIndex, {
                headers: {
                    'Content-Type':'application/json'
                }
            }).then(function(resp) {
                return resp.data;
            });
        }

        function updatePost(loginUser, post) {
            var postData = {
                Id: post.Id,
                Title: post.Title,
                Description: post.Description,
                Content: post.Content,
                Pv: 0,
                PublishedDate: post.PublishedDate,
                PublishedBy: post.PublishedBy,
                CreatedDate: post.CreatedDate,
                CreatedBy: post.CreatedBy,
                LastUpdatedDate: post.LastUpdatedDate,
                LastUpdatedBy: loginUser.Id,
                IsDeleted: false
            };

            if (DEBUG) {
                console.log('loginUser', loginUser);
                console.log('postData', postData);
            }

            return $http.put(APIURL + '/Posts/' + post.Id, JSON.stringify(postData), {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (resp) {
                return resp.data;
            });
        }

        function deletePostById(postId) {
            return $http.delete(APIURL + '/Posts/' + postId, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (resp) {
                return resp.data;
            });
        }
    }
})();