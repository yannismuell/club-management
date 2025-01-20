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
ClubManagementApp.controllers.controller('MatchesPageCtrl', function ($scope, $log, HTTP_ERRORS) {
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
// Benutzerdefinierte Filterfunktion im Controller
$scope.upcomingMatches = function(match) {
    var today = new Date();
    var matchDate = new Date(match.matchDate);
    return matchDate >= today;
};

$scope.lastMatches = function(match) {
    var today = new Date();
    var matchDate = new Date(match.matchDate);
    return matchDate < today;
};

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
 * @name Teams_membersCtrl
 *
 * @description
 * A controller used for the Teams_members page.
 */
ClubManagementApp.controllers.controller('Teams_membersCtrl', function ($scope, $log, HTTP_ERRORS) {
    activeURL = '#!/teams_members';
    console.log("bin aaaaa")
    $scope.clubmembers = [];
    $scope.filteredClubmember = [];

    $scope.pagination = $scope.pagination || {};
    $scope.pagination.currentPage = 0;
    $scope.pagination.pageSize = 25;

    $scope.pagination.numberOfPages = function () {
        return Math.ceil($scope.filteredClubmember.length / $scope.pagination.pageSize);
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

 $scope.queryClubmemberByName = function (search_field) {
        $scope.filteredTeams = [];
        $scope.clubmembers.forEach(function(element) {
            let nameToSearch = element.name.toLowerCase();
            let searchString = search_field.toLowerCase();
            {
                $scope.filteredClubmember.push(element);
            }
        });
        $scope.pagination.currentPage = 0;
    }

    $scope.init = function () {
        console.log("bin im init")
        var retrieveClubmember = function () {
            console.log("bin im retrieve")
            $scope.loading = true;
            gapi.client.clubmanagement.getClubmembersName().
                execute(function (resp) {
                    $scope.$apply(function () {
                        $scope.loading = false;
                        if (resp.error) {
                            // The request has failed.
                            var errorMessage = resp.error.message || '';
                            $scope.messages = 'Failed to obtain clubmembers : ' + errorMessage;
                            $scope.alertStatus = 'warning';
                            $log.error($scope.messages );
                        } else {
                            // The request has succeeded.
                            $scope.submitted = false;
                            $scope.messages = 'Query succeeded';
                            $scope.alertStatus = 'success';
                            $log.info($scope.messages);
                            $scope.teams = resp.items;
                            $scope.filteredClubmember = $scope.clubmembers;
                            parentProvider.clubmembers = $scope.clubmembers;
                        }
                        $scope.submitted = true;
                    });
                }
            );
        };
        retrieveClubmember();

    };

});

/**
 * @ngdoc controller
 * @name TeamsPageCtrl
 *
 * @description
 * A controller used for the TeamsPage page.
 */
ClubManagementApp.controllers.controller('TeamsPageCtrl', function ($scope, $log, HTTP_ERRORS) {
    activeURL = '#!/teamsPage';
    console.log("bin aaaaa")
    $scope.teams = [];
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
/**
* @ngdoc controller
* @name RootCtrl
*
* @description
* A controller used for the page root.
*/

ClubManagementApp.controllers.controller('RootCtrl', function ($scope, $location, $log, $timeout,) {

    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    }

    $scope.getActiveURL = function() {
        return activeURL;
    }

    $scope.isAdmin = function () {
        if ($scope.clubmember == null) {
            $scope.clubmember = {};
            $scope.clubmember.isAdmin = false;
        }
        return $scope.clubmember.isAdmin;
    };

    $scope.isCoach = function () {
        if ($scope.clubmember == null) {
            $scope.clubmember = {};
            $scope.clubmember.isCoach = false;
        }
        return $scope.clubmember.isCoach;
    };

    $scope.getSignedInState = function () {
        return $scope.isSignedIn;
    }

    $scope.grantSignIn = function () {
        $scope.isSignedIn = true;
    }

    $scope.denySignIn = function () {
        $scope.isSignedIn = false;
        $scope.clubmember = {};
        $scope.clubmember.isAdmin = false;
        $scope.clubmember.isCoach = false;
        $location.path( "#!/about" );
    }

        $scope.createClubmember = function (clubmemberForm) {
            if (!$scope.isValidClubmember(clubmemberForm)) {
                return;
            }

            var createClubmember = function() {
                $scope.loading = true;
                gapi.client.clubmanagement.createClubmember($scope.clubmember).
                execute(function (resp) {
                    $scope.$apply(function () {
                        $scope.loading = false;
                        if (resp.error) {
                            // The request has failed.
                            var errorMessage = resp.error.message || '';
                            $scope.messages = 'Failed to save an clubmember: ' + errorMessage;
                            $scope.alertStatus = 'warning';
                            $log.error($scope.messages + ' Clubmember : ' + JSON.stringify($scope.clubmember));
                        } else {
                            // The request has succeeded.
                            $scope.messages = 'The clubmember has been saved : ' + resp.result.surName;
                            $scope.alertStatus = 'success';
                            $scope.submitted = false;
                        }
                    });
                });
            }
            createClubmember();

            document.getElementById("firstName").focus();
        };

        $scope.clubmemberExists = function() {
            var clubmemberExists = function() {
                $scope.loading = true;
                gapi.client.clubmanagement.clubmemberExists({clubmemberEmail: userEmail}).execute(function (resp) {
                    $scope.$apply(function () {
                        $scope.loading = false;
                        if (resp.error) {
                            // The request has failed.
                            var errorMessage = resp.error.message || '';
                            $scope.messages = 'Failed to get info on clubmember: '  + ' ' + errorMessage;
                            $scope.alertStatus = 'warning';
                            $log.error($scope.messages);
                        } else {
                            // The request has succeeded.
                            $scope.alertStatus = 'success';
                            if (resp.result.id != null) { // id present means: clubmember exists
                                $scope.clubmember = resp.result
                                $location.path( "/" );
                            } else {
                                window.location.href = "index.html";
                                 $scope.messages = 'Account does not exist! Please contact an administrator: '  + ' ' + errorMessage;
                                 $scope.alertStatus = 'warning';
                            }
                        }
                    });
                });
            }
            clubmemberExists();
        };

        $scope.collapseNavbar = function () {
                angular.element(document.querySelector('.navbar-collapse')).removeClass('in');
        };

});
