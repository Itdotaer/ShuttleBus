(function() {
    'use sctrict';

    var app = angular.module('app', ['ui.router', 'ngCookies', 'angular-md5', 'services']);

    app.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
    ]);

    router.$inject = ['$stateProvider', '$urlRouterProvider'];
    routeChanged.$inject = ['$cookies', '$state', '$rootScope', '$location'];

    //Router
    app.config(router);
    app.run(routeChanged);    

    function router($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: '/app/views/main.html',
                controller: 'mainController',
                controllerAs: 'vm'
            })
            .state('login', {
                url: '/login',
                templateUrl: '/app/views/user/login.html',
                controller: 'loginController',
                controllerAs: 'vm'
            })
            .state('logout', {
                url: '/logout',
                controller: 'logoutController',
                controllerAs: 'vm'
            })
            .state('userInfo', {
                url: '/userInfo',
                templateUrl: '/app/views/user/userInfo.html',
                data: {
                    requireLogin: true
                }
            })
            .state('editUserInfo', {
                url: '/editUserInfo',
                templateUrl: '/app/views/user/editUserInfo.html',
                controller: 'editUserInfoController',
                controllerAs: 'vm',
                data: {
                    requireLogin: true
                }
            });
    }

    function routeChanged($cookies, $state, $rootScope, $location) {
        $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {
            var shouldLogin = toState.data !== undefined && toState.data.requireLogin;
            var loginUser = angular.fromJson($cookies.get('loginUser'));
            if (loginUser) {
                //User logined in
                $rootScope.authorised = true;
                $rootScope.userInfo = loginUser;
            } else {
                $rootScope.authorised = false;
            }

            if (shouldLogin === true) {
                if (!loginUser) {
                    $state.go('login');
                    e.preventDefault();

                    $rootScope.authorised = false;
                }
            }

            return;   
        });
    }

    //Constants
    app.constant('DEBUG', true);
    app.constant('APIURL', 'http://forceful-fireball-82-165054.apne1.nitrousbox.com/');
})();