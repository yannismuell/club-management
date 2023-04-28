'use strict';

/**
 * The root clubmanagement module.
 *
 * @type {ClubManagementApp|*|{}}
 */
var ClubManagementApp = ClubManagementApp || {};
var activeURL = '#!/departments';


/**
 * @ngdoc module
 * @name clubmanagementControllers
 *
 * @description
 * Angular module for controllers.
 *
 */
ClubManagementApp.controllers = angular.module('clubmanagementControllers', ['ui.bootstrap']);



/**
 * @ngdoc controller
 * @name DocumentationCtrl
 *
 * @description
 * A controller used for the Documentation page.
 */
ClubManagementApp.controllers.controller('DocumentationCtrl', function ($scope, $log, oauth2Provider, HTTP_ERRORS) {


});

/**
 * @ngdoc controller
 * @name AccountCtrl
 *
 * @description
 * A controller used for the Account page.
 */
ClubManagementApp.controllers.controller('AccountCtrl', function ($scope, $log, oauth2Provider, HTTP_ERRORS) {
    $scope.submitted = false;
    $scope.loading = false;

    $scope.initialAccount = {};

    $scope.init = function () {
        var retrieveAccountCallback = function () {
            $scope.account = {};
            $scope.loading = true;
            gapi.client.clubmanagement.getAccount().
                execute(function (resp) {
                    $scope.$apply(function () {
                        $scope.loading = false;
                        if (resp.error) {
                            // Failed to get a user account.
                            console.log(' unable to get account');
                        } else {
                            // Succeeded to get the user acount.
                            $scope.account.firstName = resp.result.firstName;
                            $scope.account.surName = resp.result.surName;
                            $scope.account.companyName = resp.result.companyName;
                            $scope.account.mainEmail = resp.result.mainEmail;
                            $scope.account.restTime = resp.result.restTime;
                            $scope.initialAccount = resp.result;
                        }
                    });
                }
            );
        };

        if (!oauth2Provider.signedIn) {
            var modalInstance = oauth2Provider.showLoginModal();
            modalInstance.result.then(retrieveAccountCallback);
        } else {
            retrieveAccountCallback();
        }
    };

    $scope.saveAccount = function () {
        $scope.submitted = true;
        $scope.loading = true;
        var callback = function() {
        gapi.client.clubmanagement.saveAccount($scope.account).
            execute(function (resp) {
                $scope.$apply(function () {
                    $scope.loading = false;
                    if (resp.error) {
                        // The request has failed.
                        var errorMessage = resp.error.message || '';
                        $scope.messages = 'Failed to update an account : ' + errorMessage;
                        $scope.alertStatus = 'warning';
                        $log.error($scope.messages + 'Account : ' + JSON.stringify($scope.account));

                        if (resp.code && resp.code == HTTP_ERRORS.UNAUTHORIZED) {
                            oauth2Provider.showLoginModal();
                            return;
                        }
                    } else {
                        // The request has succeeded.
                        $scope.messages = 'The account has been updated';
                        $scope.alertStatus = 'success';
                        $scope.submitted = false;
                        $scope.initialAccount = {
                            firstName: $scope.account.firstName,
                            surName: $scope.account.surName,
                            companyName: $scope.account.companyName,
                            mainEmail: $scope.account.mainEmail,
                            restTime: $scope.account.restTime
                        };
                        window.history.back();
                        $log.info($scope.messages + JSON.stringify(resp.result));
                    }
                });
            });
        }

        if (!oauth2Provider.signedIn) {
            oauth2Provider.signIn(callback);
        } else {
            callback();
        }
    };

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

    $scope.initSignInButton = function () {
        gapi.signin.render('signInButton', {
            'callback': function () {
                jQuery('#signInButton button').attr('disabled', 'true').css('cursor', 'default');
                if (gapi.auth.getToken() && gapi.auth.getToken().access_token) {
                    $scope.$apply(function () {
                        oauth2Provider.signedIn = true;
                    });
                }
            },
            'clientid': oauth2Provider.CLIENT_ID,
            'cookiepolicy': 'single_host_origin',
            'scope': oauth2Provider.SCOPES
        });
    };

    $scope.signIn = function () {
        oauth2Provider.signIn(function () {
            console.log(gapi.client.oauth2.userinfo.get());
            gapi.client.oauth2.userinfo.get().execute(function (resp) {
                $scope.$apply(function () {
                    console.log(resp);
                    if (resp.email) {
                        oauth2Provider.signedIn = true;
                        $scope.alertStatus = 'success';
                        $scope.rootMessages = 'Logged in with ' + resp.email;
                    }
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