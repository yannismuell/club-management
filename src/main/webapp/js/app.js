'use strict';

var app = angular.module('QRcoolApp', ['QRcoolControllers', 'ngRoute', 'ui.bootstrap']).config(['$routeProvider', function ($routeProvider) {
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
        signedIn: false,
        signinInProgress: false
    };

    oauth2Provider.signIn = function (callback) {
        oauth2Provider.signedIn = true;
        window.location.href = '#!/home.html'
    };

    oauth2Provider.signOut = function () {
        google.accounts.id.disableAutoSelect();
        oauth2Provider.signedIn = false;
    };

    return oauth2Provider;
});
