'use strict';

/**
 * The root project module.
 *
 * @type {QRcoolApp|*|{}}
 */
var QRcoolApp = QRcoolApp || {};
var activeURL = '#!/departments';


/**
 * @ngdoc module
 * @name QRcooControllers
 *
 * @description
 * Angular module for controllers.
 *
 */
QRcoolApp.controllers = angular.module('QRcoolControllers', ['ui.bootstrap']);

/**
 * @ngdoc controller
 * @name DocumentationCtrl
 *
 * @description
 * A controller used for the Documentation page.
 */
QRcoolApp.controllers.controller('DocumentationCtrl', function ($scope, $log, oauth2Provider, HTTP_ERRORS) {
});

/**
 * @ngdoc controller
 * @name AccountCtrl
 *
 * @description
 * A controller used for the Account page.
 */
QRcoolApp.controllers.controller('AccountCtrl', function ($scope, $log, oauth2Provider, HTTP_ERRORS) {
    $scope.submitted = false;
    $scope.loading = false;

    $scope.initialAccount = {};

    $scope.init = function () {
        var retrieveAccountCallback = function () {
            $scope.account = {};
            $scope.loading = true;
            gapi.client.qrcool.getAccount().
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
        gapi.client.qrcool.saveAccount($scope.account).
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

QRcoolApp.controllers.controller('RootCtrl', function ($scope, $location, $timeout, oauth2Provider) {

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
        function handleCredentialResponse(response) {
            //console.log("Encoded JWT ID token: " + response.credential);
            $scope.signIn();
            window.location.href = '#!/home.html'
        }
        window.onload = function () {
            google.accounts.id.initialize({
                client_id: "245448757721-vv3901m75sukgnqqh39mhutjm5fqnhnt.apps.googleusercontent.com",
                callback: handleCredentialResponse
            });

            google.accounts.id.renderButton(document.getElementById("signInButton"), {
                theme: 'outline',
                size: 'large',
                click_listener: $scope.signIn
            });

            google.accounts.id.prompt(); // also display the One Tap dialog
        }
    };

    $scope.signIn = function () {
        oauth2Provider.signIn();
        $scope.alertStatus = 'success';
        $scope.rootMessages = 'Logged ';
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