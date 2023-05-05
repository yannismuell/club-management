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
        when('/departments', {
             templateUrl: 'partials/departments.html',
             controller: 'getDepartmentsCtrl'
        }).
        when('/departments/create', {
              templateUrl: 'partials/departments_create.html',
              controller: 'createDepartmentCtrl'
        }).
        when('/departments/edit/:websafeDepartmentKey', {
              templateUrl: 'partials/departments_edit.html',
              controller: 'saveDepartmentCtrl'
        }).
        when('/departments/delete/:websafeDepartmentKey', {
              templateUrl: 'partials/departments.html',
              controller: 'getDepartmentCtrl'
        }).
        when('/departments/detail/:websafeDepartmentKey', {
                templateUrl: 'partials/department_details.html',
                controller: 'detailedDepartmentCtrl'
        }).
                /*when('/clubmembers', {
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
                        controller: 'detailedClubmemberCtrl'*/
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

    parentProvider.departments = [];

    parentProvider.department = {};

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
