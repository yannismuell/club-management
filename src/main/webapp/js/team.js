
/**
 * @ngdoc controller
 * @name getTeamCtrl
 *
 * @players
 * A controller used to save a team page.
 */
ClubManagementApp.controllers.controller('getTeamsCtrl', function ($scope, $log, $location, $route, parentProvider, $routeParams, $uibModal, HTTP_ERRORS) {

    document.getElementById("query-input").focus();

    $scope.submitted = false;
    $scope.loading = false;
    activeURL = '#!/teams';

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
            if (nameToSearch.includes(searchString))
            {
                $scope.filteredTeams.push(element);
            }
        });
        $scope.pagination.currentPage = 0;
    }

    $scope.init = function () {
        var retrieveTeamsCallback = function () {
            $scope.loading = true;
            gapi.client.clubmanagement.getTeams().
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
                            //parentProvider.teams = $scope.teams;
                            console.log("retrieve: ", JSON.stringify($scope.teams))
                        }
                        $scope.submitted = true;
                    });
                }
            );
        };
        retrieveTeamsCallback();
    };

    // $scope.team = {};

    $scope.deleteTeamWithWebsafeTeamKey = function (websafeTeamKey) {
        var deleteTeam = function() {
            $scope.loading = true;
            gapi.client.clubmanagement.deleteTeam({websafeTeamKey: websafeTeamKey})
            .execute(function (resp) {
                $scope.$apply(function () {
                    $scope.loading = false;
                    if (resp.error) {
                        // The request has failed.
                        var errorMessage = resp.error.message || '';
                        $scope.messages = 'Failed to delete team : ' + errorMessage;
                        $scope.alertStatus = 'warning';
                        $log.error($scope.messages + ' Team : ' + JSON.stringify($scope.team));
                    } else {
                        // The request has succeeded.
                        $scope.messages = 'The team has been deleted ';
                        $scope.alertStatus = 'success';
                        $scope.submitted = false;
                        $scope.team = {};
                        $log.info($scope.messages + ' : ' + JSON.stringify(resp.result));
                        $route.reload();
                    }
                });
            });
        }
        deleteTeam();
    };
});

/**
 * @ngdoc controller
 * @name detailedTeamCtrl
 *
 * @players
 * A controller used to save a team page.
 */
ClubManagementApp.controllers.controller('detailedTeamCtrl', function ($scope, $log, $location, $timeout, $route, $uibModal, $routeParams, parentProvider, HTTP_ERRORS) {

    $scope.team = {};
    $scope.submitted = false;
    $scope.length = 0;

    $scope.pagination = $scope.pagination || {};
    $scope.pagination.currentPage = 0;
    $scope.pagination.pageSize = 25;

    $scope.pagination.numberOfPages = function () {
        return Math.ceil($scope.length / $scope.pagination.pageSize);
    };

    $scope.pagination.isDisabled = function (event) {
        return angular.element(event.target).hasClass('disabled');
    }

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

    Array.prototype.clone = function(){
      return this.slice(0)
    }

    $scope.collapseNavbar = function () {
        angular.element(document.querySelector('.navbar-collapse')).removeClass('in');
    };

    $scope.deleteTeam = function (teamForm) {
        var deleteTeam = function() {
            $scope.loading = true;
            $scope.submitted = true;
            gapi.client.clubmanagement.deleteTeam({websafeTeamKey: $routeParams.websafeTeamKey})
            .execute(function (resp) {
                $scope.$apply(function () {
                    $scope.loading = false;
                    if (resp.error) {
                        var errorMessage = resp.error.message || '';
                        $scope.messages = 'Failed to delete team : ' + errorMessage;
                        $scope.alertStatus = 'warning';
                        $log.error($scope.messages + ' Team : ' + JSON.stringify($scope.team));
                        $route.reload();
                    } else {
                        $scope.messages = 'The team has been deleted ';
                        $scope.alertStatus = 'success';
                        $scope.submitted = false;
                        $scope.team = {};
                        $log.info($scope.messages + ' : ' + JSON.stringify(resp.result));
                        $timeout(function () {
                            $location.path('/teams');
                            $route.reload();
                        });
                    }
                });
            });
        }
    };

    $scope.init = function () {
        var getTeam = function() {
            $scope.loading = true;
            $scope.submitted = true;
            gapi.client.clubmanagement.getTeam({websafeTeamKey: $routeParams.websafeTeamKey}).execute(function (resp) {
                $scope.$apply(function () {
                    $scope.loading = false;
                    if (resp.error) {
                        var errorMessage = resp.error.message || '';
                        $scope.messages = 'Failed to get the team : ' + $routeParams.websafeTeamKey  + ' ' + errorMessage;
                        $scope.alertStatus = 'warning';
                        $log.error($scope.messages);
                    } else {
                        $scope.submitted = false;
                        $scope.alertStatus = 'success';
                        $scope.team = resp.result;
                        parentProvider.team = $scope.team;
                        if ($scope.team == null) { $scope.team = []; }
                    }
                });
            });
        }

        getTeam();
    };
});

/**
 * @ngdoc controller
 * @name createTeamCtrl
 *
 * @players
 * A controller used to save a team page.
 */
ClubManagementApp.controllers.controller('createTeamCtrl', function ($scope, $log, $location, $routeParams, HTTP_ERRORS) {

    $scope.team = {};

    document.getElementById("name").focus();

    $scope.isValidTeam = function (teamForm) {
        return !teamForm.$invalid;
    }

    $scope.createTeam = function (teamForm) {
        if (!$scope.isValidTeam(teamForm)) {
            return;
        }

        var createTeam = function() {
            $scope.loading = true;
            console.log("create: ", $scope.team);
            gapi.client.clubmanagement.createTeam($scope.team).
            execute(function (resp) {
                $scope.$apply(function () {
                    $scope.loading = false;
                    if (resp.error) {
                        // The request has failed.
                        var errorMessage = resp.error.message || '';
                        $scope.messages = 'Failed to save a team : ' + errorMessage;
                        $scope.alertStatus = 'warning';
                        $log.error($scope.messages + ' Team : ' + JSON.stringify($scope.team));
                    } else {
                        // The request has succeeded.
                        $scope.messages = 'The team has been saved : ' + resp.result.name;
                        $scope.alertStatus = 'success';
                        $scope.submitted = false;
                        $scope.team = {};
                        $log.info($scope.messages + ' : ' + JSON.stringify(resp.result));
                    }
                });
            });
        }
        createTeam();

        document.getElementById("name").focus();
    };

    $scope.init = function () {
    $scope.newTeam = {};
    };
});

/**
 * @ngdoc controller
 * @name saveTeamCtrl
 *
 * @players
 * A controller used to save a team page.
 */
ClubManagementApp.controllers.controller('saveTeamCtrl', function ($scope, $log, $location, $route, $routeParams, HTTP_ERRORS) {

    $scope.team = {};

    $scope.init = function () {
        var getTeam = function() {
            $scope.loading = true;
            gapi.client.clubmanagement.getTeam({websafeTeamKey: $routeParams.websafeTeamKey
            }).execute(function (resp) {
                $scope.$apply(function () {
                    $scope.loading = false;
                    if (resp.error) {
                        // The request has failed.
                        var errorMessage = resp.error.message || '';
                        $scope.messages = 'Failed to get the team : ' + $routeParams.websafeTeamKey  + ' ' + errorMessage;
                        $scope.alertStatus = 'warning';
                        $log.error($scope.messages);
                    } else {
                        // The request has succeeded.
                        $scope.alertStatus = 'success';
                        $scope.team = resp.result;
                    }
                });
            });
        }

        getTeam();
    };

    $scope.isValidTeam = function (teamForm) {
        return !teamForm.$invalid;
    }

    $scope.saveTeam = function () {
         $scope.submitted = true;
         $scope.loading = true;
         var saveTeam = function() {
             gapi.client.clubmanagement.saveTeam($scope.team)
             .execute(function (resp) {
                 $scope.$apply(function () {
                    $scope.loading = false;
                     if (resp.error) {
                         var errorMessage = resp.error.message || '';
                         $scope.messages = 'Failed to save a team : ' + errorMessage;
                         $scope.alertStatus = 'warning';
                         $log.error($scope.messages + ' Team : ' + JSON.stringify($scope.team));
                     } else {
                         $scope.messages = 'The team has been saved : ' + resp.result.name;
                         $scope.alertStatus = 'success';
                         $scope.submitted = false;
                         $scope.team = {};
                         $log.info($scope.messages + ' : ' + JSON.stringify(resp.result));
                         window.history.back();
                     }
                 });
             });
         }

         saveTeam();
    };
});
