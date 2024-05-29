'use strict';

var app = angular.module('ClubManagementApp', ['clubmanagementControllers', 'ngRoute', 'ui.bootstrap']).config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/home', {
            templateUrl: 'index.html',
            controller: 'RootCtrl'
        }).
        when('/matchesPage', {
            templateUrl: 'partials/matchesPage.html',
            controller: 'MatchesPageCtrl'
        }).
        when('/teamsPage', {
              templateUrl: 'partials/teamsPage.html',
              controller: 'TeamsPageCtrl'
        }).
        when('/teams/members/:websafeTeamKey', {
                        templateUrl: 'partials/teams_members.html',
                        controller: 'Teams_membersCtrl'
                }).
        when('/matches', {
             templateUrl: 'partials/match/matches.html',
             controller: 'getMatchesCtrl'
        }).
        when('/matches/create', {
              templateUrl: 'partials/matches_create.html',
              controller: 'createMatchCtrl'
        }).
        when('/matches/edit/:websafeMatchKey', {
              templateUrl: 'partials/matches_edit.html',
              controller: 'saveMatchCtrl'
        }).
        when('/matches/delete/:websafeMatchKey', {
              templateUrl: 'partials/matches.html',
              controller: 'getMatchCtrl'
        }).
        when('/matches/detail/:websafeMatchKey', {
                templateUrl: 'partials/match_details.html',
                controller: 'detailedMatchCtrl'
        }).
        when('/clubmembers', {
             templateUrl: 'partials/clubmembers.html',
             controller: 'getClubmembersCtrl'
        }).
        when('/clubmembers/create', {
              templateUrl: 'partials/clubmembers_create.html',
              controller: 'createClubmemberCtrl'
        }).
        when('/clubmembers/edit/:websafeClubmemberKey', {
              templateUrl: 'partials/clubmembers_edit.html',
              controller: 'saveClubmemberCtrl'
        }).
        when('/clubmembers/delete/:websafeClubmemberKey', {
              templateUrl: 'partials/clubmembers.html',
              controller: 'getClubmemberCtrl'
        }).
        when('/clubmembers/detail/:websafeClubmemberKey', {
                templateUrl: 'partials/clubmember_details.html',
                controller: 'detailedClubmemberCtrl'
        }).
        when('/teams', {
             templateUrl: 'partials/teams.html',
             controller: 'getTeamsCtrl'
        }).
        when('/teams/create', {
              controller: 'createTeamCtrl',
              templateUrl: 'partials/teams_create.html',
        }).
        when('/teams/edit/:websafeTeamKey', {
              templateUrl: 'partials/teams_edit.html',
              controller: 'saveTeamCtrl'
        }).
        when('/teams/delete/:websafeTeamKey', {
              templateUrl: 'partials/teams.html',
              controller: 'getTeamCtrl'
        }).
        when('/teams/detail/:websafeTeamKey', {
                templateUrl: 'partials/team_details.html',
                controller: 'detailedTeamCtrl'
        }).
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

    parentProvider.teams = [];

    parentProvider.team = {};

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
