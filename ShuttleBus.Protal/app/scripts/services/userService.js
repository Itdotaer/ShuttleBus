(function() {
    'use strict';

    angular
        .module('services')
        .factory('userService', userService);

    userService.$inject = ['$http', '$cookies', 'md5','logger', 'APIURL', 'DEBUG'];

    function userService($http, $cookies, md5, logger, APIURL, DEBUG) {
        var service = {
            login: login,
            getMd5: getMd5,
            update: update,
            getUserById: getUserById
        };

        return service;

        function login(user) {
            var loginUser =
                {
                    userName: user.userName,
                    password: user.password
                };
            if (user.isMd5Encorpy === false) {
                //Md5 Encorpy
                loginUser.password = getMd5(loginUser.password);
            }

            //Validate user info from backend database.
            return $http.post(APIURL + 'api/users/login', angular.toJson(loginUser), {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (resp) {
                return resp.data;
            });
        }

        function getMd5(input) {
            return md5.createHash(input);
        }

        function update(user) {
            return $http.put(APIURL + 'api/users/' + user._id, angular.toJson(user), {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function(resp) {
                return resp.data;
            });
        }

        function getUserById(userId) {
            return $http.get(APIURL + 'api/users/' + userId).then(function(resp) {
                return resp.data;
            });
        }
    }
})();