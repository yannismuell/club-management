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
    activeURL = '#!/matchesPage';
    console.log("bin aaaaa")
    $scope.matches = [];
    $scope.filteredMatches = [];

    $scope.pagination = $scope.pagination || {};
    $scope.pagination.currentPage = 0;
    $scope.pagination.pageSize = 25;

    $scope.pagination.numberOfPages = function () {
        return Math.ceil($scope.filteredMatches.length / $scope.pagination.pageSize);
    };

    $scope.pagination.pageArray = function () {
        var pages = [];
        var numberOfPages = $scope.pagination.numberOfPages();
        for (var i = 0; i < numberOfPages; i++) {
            pages.push(i);
        }
        return pages;
    }

    $scope.pagination.isDisabled = function (event) {
        return angular.element(event.target).hasClass('disabled');
    }

    $scope.queryMatchesByMatchDate = function (search_field) {
        $scope.filteredMatches = [];
        $scope.matches.forEach(function(element) {
            let matchDateToSearch = element.matchDate.toLowerCase();
            let matchTimeToSearch = element.matchTime.toLowerCase();
            let searchString = search_field.toLowerCase();
            if (matchDateToSearch.includes(searchString) || matchTimeToSearch.includes(searchString)){
                $scope.filteredMatches.push(element);
            }
        });
        $scope.pagination.currentPage = 0;
    }

    $scope.init = function () {
        console.log("bin im init")
        var retrieveMatches = function () {
            console.log("bin im retrieve")
            $scope.loading = true;
            gapi.client.clubmanagement.getMatchesGuest().
                execute(function (resp) {
                    $scope.$apply(function () {
                        $scope.loading = false;
                        if (resp.error) {
                            // The request has failed.
                            var errorMessage = resp.error.message || '';
                            $scope.messages = 'Failed to obtain matches : ' + errorMessage;
                            $scope.alertStatus = 'warning';
                            $log.error($scope.messages );
                        } else {
                            // The request has succeeded.
                            $scope.submitted = false;
                            $scope.messages = 'Query succeeded';
                            $scope.alertStatus = 'success';
                            $log.info($scope.messages);
                            $scope.matches = resp.items;
                            $scope.filteredMatches = $scope.matches;
                            parentProvider.matches = $scope.matches;
                        }
                        $scope.submitted = true;
                    });
                }
            );
        };
        retrieveMatches();

    };

});

/**
 * @ngdoc controller
 * @name TeamsPageCtrl
 *
 * @description
 * A controller used for the TeamsPage page.
 */
ClubManagementApp.controllers.controller('TeamsPageCtrl', function ($scope, $log, oauth2Provider, HTTP_ERRORS) {
    activeURL = '#!/teamsPage';
    console.log("bin aaaaa")
    $scope.matches = [];
    $scope.filteredTeams = [];

    $scope.pagination = $scope.pagination || {};
    $scope.pagination.currentPage = 0;
    $scope.pagination.pageSize = 25;

    $scope.pagination.numberOfPages = function () {
        return Math.ceil($scope.filteredTeams.length / $scope.pagination.pageSize);
    };

    $scope.pagination.pageArray = function () {
        var pages = [];
        var numberOfPages = $scope.pagination.numberOfPages();
        for (var i = 0; i < numberOfPages; i++) {
            pages.push(i);
        }
        return pages;
    }

    $scope.pagination.isDisabled = function (event) {
        return angular.element(event.target).hasClass('disabled');
    }

 $scope.queryTeamsByName = function (search_field) {
        $scope.filteredTeams = [];
        $scope.teams.forEach(function(element) {
            let nameToSearch = element.name.toLowerCase();
            let searchString = search_field.toLowerCase();
            {
                $scope.filteredTeams.push(element);
            }
        });
        $scope.pagination.currentPage = 0;
    }

    $scope.init = function () {
        console.log("bin im init")
        var retrieveTeams = function () {
            console.log("bin im retrieve")
            $scope.loading = true;
            gapi.client.clubmanagement.getTeamsName().
                execute(function (resp) {
                    $scope.$apply(function () {
                        $scope.loading = false;
                        if (resp.error) {
                            // The request has failed.
                            var errorMessage = resp.error.message || '';
                            $scope.messages = 'Failed to obtain teams : ' + errorMessage;
                            $scope.alertStatus = 'warning';
                            $log.error($scope.messages );
                        } else {
                            // The request has succeeded.
                            $scope.submitted = false;
                            $scope.messages = 'Query succeeded';
                            $scope.alertStatus = 'success';
                            $log.info($scope.messages);
                            $scope.teams = resp.items;
                            $scope.filteredTeams = $scope.teams;
                            parentProvider.teams = $scope.teams;
                        }
                        $scope.submitted = true;
                    });
                }
            );
        };
        retrieveTeams();

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