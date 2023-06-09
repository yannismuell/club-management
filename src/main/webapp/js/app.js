'use strict';

var app = angular.module('ClubManagementApp', ['clubmanagementControllers', 'ngRoute', 'ui.bootstrap']).config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/home', {
            templateUrl: 'index.html',
            controller: 'RootCtrl'
        }).
        when('/account', {
            templateUrl: 'partials/account.html',
            controller: 'AccountCtrl'
        }).
        when('/account_edit', {
            templateUrl: 'partials/account_edit.html',
            controller: 'AccountCtrl'
        }).
        when('/documentation', {
            templateUrl: 'partials/documentation.html',
            controller: 'DocumentationCtrl'
        }).
        when('/matches', {
             templateUrl: 'partials/matches.html',
             controller: 'getMatchesCtrl'
        }).
        when('/matches/create', {
              templateUrl: 'partials/matches_create.html',
              controller: 'createMatchCtrl'
        }).
        when('/matches/edit/:websafeMatchey', {
              templateUrl: 'partials/matches_edit.html',
              controller: 'saveMatchCtrl'
        }).
        when('/matches/delete/:websafeMatchKey', {
              templateUrl: 'partials/matches.html',
              controller: 'getMatchCtrl'
        }).
        when('/matches/detail/:websafeMatchKey', {
                templateUrl: 'partials/match_details.html',
                controller: ''
        }).
                when('/clubmembers', {
                     templateUrl: 'partials/clubmembers.html',
                     controller: 'getClubmembersCtrl'
                }).
                when('/clubmembers/create', {
                      templateUrl: 'partials/clubmembers_create.html',
                      controller: 'createClubmemberCtrl'
                }).
/*
                when('/clubmembers/edit/:websafeClubmemberKey', {
                      templateUrl: 'partials/clubmembers_edit.html',
                      controller: 'saveClubmemberCtrl'.

                }).
                when('/clubmembers/delete/:websafeClubmemberKey', {
                      templateUrl: 'partials/clubmembers.html',
                      controller: 'getClubmemberCtrl'
                }).

                when('/clubmembers/detail/:websafeClubmemberKey', {
                        templateUrl: 'partials/clubmember_details.html',
                        controller: 'detailedClubmemberCtrl'

                                when('/trainers', {
                                     templateUrl: 'partials/trainers.html',
                                     controller: 'getTrainersCtrl'
                                }).
                                when('/trainers/create', {
                                      templateUrl: 'partials/trainers_create.html',
                                      controller: 'createTrainerCtrl'
                                      /*
                                }).
                                when('/trainers/edit/:websafeTrainerKey', {
                                      templateUrl: 'partials/trainers_edit.html',
                                      controller: 'saveTrainerCtrl'.

                                }).
                                when('/trainers/delete/:websafeTrainerKey', {
                                      templateUrl: 'partials/trainers.html',
                                      controller: 'getTrainerCtrl'
                                }).

                                when('/trainers/detail/:websafeTrainerKey', {
                                        templateUrl: 'partials/trainer_details.html',
                                        controller: 'detailedTrainerCtrl'
                                        */
        when('/impressum', {
            templateUrl: 'partials/impressum.html'
        }).
        when('/', {
            templateUrl: 'partials/home.html'
        }).
        otherwise({
            redirectTo: '/'
        });
    }]);

app.constant('HTTP_ERRORS', {
    'UNAUTHORIZED': 401
});

app.filter('startFrom', function () {
    var filter = function (data, start) {
        return data.slice(start);
    }
    return filter;
});

app.factory('parentProvider', function ($uibModal) {

    var parentProvider = {};

    parentProvider.matches = [];

    parentProvider.match = {};

    parentProvider.clubmembers = [];

    parentProvider.clubmember = {};

    parentProvider.trainers = [];

    parentProvider.trainer = {};

    return parentProvider;

});

app.factory('oauth2Provider', function ($uibModal) {

    var oauth2Provider = {
        CLIENT_ID: GOOGLE_APP_ENGINE_CLIENT_ID,
        SCOPES: 'https://www.googleapis.com/auth/userinfo.email profile',
        signedIn: false,
        signinInProgress: false
    };

    oauth2Provider.signIn = function (callback) {
        gapi.auth.signIn({
            'clientid': oauth2Provider.CLIENT_ID,
            'cookiepolicy': 'single_host_origin',
            'accesstype': 'online',
            'approveprompt': 'auto',
            'scope': oauth2Provider.SCOPES,
            'callback': callback
        });
    };

    oauth2Provider.signOut = function () {
        //gapi.auth.signOut();
        gapi.auth2.getAuthInstance().signOut();
        oauth2Provider.signedIn = false;
    };

    oauth2Provider.showLoginModal = function() {
        var modalInstance = $modal.open({
            templateUrl: '/partials/modals/login.modal.html',
            controller: 'OAuth2LoginModalCtrl'
        });
        oauth2Provider.signedIn = true;
        return modalInstance;
    };

    return oauth2Provider;
});
