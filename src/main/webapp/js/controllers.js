'use strict';

/**
 * The root clubmanagement module.
 *
 * @type {ClubManagementApp|*|{}}
 */
var ClubManagementApp = ClubManagementApp || {};
var activeURL = '#!/matches';
var activeURL = '#!/clubmembers';
var activeURL = '#!/teams';
/**
 * @ngdoc module
 * @name clubmanagementControllers
 *
 * @surname
 * Angular module for controllers.
 *
 */
ClubManagementApp.controllers = angular.module('clubmanagementControllers', ['ui.bootstrap']);



/**
 * @ngdoc controller
 * @name MatchesPageCtrl
 *
 * @description
 * A controller used for the MatchesPage page.
 */
ClubManagementApp.controllers.controller('MatchesPageCtrl', function ($scope, $log, oauth2Provider, HTTP_ERRORS) {


});

ClubManagementApp.controllers.controller('RootCtrl', function ($scope, $location, $timeout, oauth2Provider) {

    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
    $scope.getActiveURL = function() {
        return activeURL;
    }

    $scope.getSignedInState = function () {
        return oauth2Provider.signedIn;
    };

    $scope.signIn = function () {
        /*oauth2Provider.signIn(function () {
            console.log(gapi.client.oauth2.userinfo.get());
            gapi.client.oauth2.userinfo.get().execute(function (resp) {
                $scope.$apply(function () {
                    console.log(resp);
                    $scope.signIn = function () {*/
                     oauth2Provider.signIn(function () {
                     gapi.client.oauth2.userinfo.get().execute(function (resp) {
                     $scope.$apply(function () {
                     const email = resp.email;
                     if (email === 'felix.wittmann05@gmail.com' || email === 'davidreiter01@gmail.com' || email === 'florian.hoermann5524@gmail.com' || email === 'yannismueller124@gmail.com' || email === 'carinapospichal@gmail.com') {
                     oauth2Provider.signedIn = true;
                     $scope.alertStatus = 'success';
                     $scope.rootMessages = 'Logged in with ' + resp.email;
                     }
                    return false;
                    /*if (resp.email) {
                        oauth2Provider.signedIn = true;
                        $scope.alertStatus = 'success';
                        $scope.rootMessages = 'Logged in with ' + resp.email;
                    }*/
                });
            });
        });
    };

    $scope.signOut = function () {
        oauth2Provider.signOut();
        $scope.alertStatus = 'success';
        $scope.rootMessages = 'Logged out';
    };

    $scope.collapseNavbar = function () {
        angular.element(document.querySelector('.navbar-collapse')).removeClass('in');
    };
});

ClubManagementApp.controllers.controller('OAuth2LoginModalCtrl', function ($scope, $modalInstance, $rootScope, oauth2Provider) {
    $scope.signInViaModal = function () {
        oauth2Provider.signIn(function () {
            gapi.client.oauth2.userinfo.get().execute(function (resp) {
                $scope.$root.$apply(function () {
                    $scope.$root.alertStatus = 'success';
                    $scope.$root.rootMessages = 'Logged in with ' + resp.email;
                });
                $modalInstance.close();
            });
        });
    };
});