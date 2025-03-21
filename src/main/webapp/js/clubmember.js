/**
 * @ngdoc controller
 * @name getClubmemberCtrl
 *
 * @surname
 * A controller used to save a clubmember page.
 */
ClubManagementApp.controllers.controller('getClubmembersCtrl', function ($scope, $log, $location, $route, parentProvider, $routeParams, $uibModal, HTTP_ERRORS) {

    document.getElementById("query-input").focus();

    $scope.submitted = false;
    $scope.loading = false;
    activeURL = '#!/clubmembers';

    $scope.clubmembers = [];
    $scope.filteredClubmembers = [];

    $scope.pagination = $scope.pagination || {};
    $scope.pagination.currentPage = 0;
    $scope.pagination.pageSize = 25;
    $scope.pagination.numberOfPages = function () {
        return Math.ceil($scope.filteredClubmembers.length / $scope.pagination.pageSize);
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

    $scope.queryClubmembersByName = function (search_field) {
        console.log("queryClumbembers")
        $scope.filteredClubmembers = [];
        $scope.clubmembers.forEach(function(element) {
            let nameToSearch = element.name.toLowerCase();
            let surnameToSearch = element.surname.toLowerCase();
            let searchString = search_field.toLowerCase();
            if (nameToSearch.includes(searchString) || surnameToSearch.includes(searchString)){
                $scope.filteredClubmembers.push(element);
            }
        });
        $scope.pagination.currentPage = 0;
    }

    $scope.init = function () {
        var retrieveClubmembers = function () {
            $scope.loading = true;
            gapi.client.clubmanagement.getClubmembers().
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
                            $scope.clubmembers = resp.items;
                            $scope.filteredClubmembers = $scope.clubmembers;
                            /*parentProvider.clubmembers = $scope.clubmembers;*/
                            //console.log("retrieve: ", JSON.stringify($scope.clubmembers))

                        }
                        $scope.submitted = true;
                    });
                }
            );
        };
        retrieveClubmembers();
    };

    $scope.deleteClubmemberWithWebsafeClubmemberKey = function (websafeClubmemberKey) {
        var deleteClubmember = function() {
            $scope.loading = true;
            gapi.client.clubmanagement.deleteClubmember({websafeClubmemberKey: websafeClubmemberKey})
            .execute(function (resp) {
                $scope.$apply(function () {
                    $scope.loading = false;
                    if (resp.error) {
                        // The request has failed.
                        var errorMessage = resp.error.message || '';
                        $scope.messages = 'Failed to delete clubmember : ' + errorMessage;
                        $scope.alertStatus = 'warning';
                        $log.error($scope.messages + ' Clubmember : ' + JSON.stringify($scope.clubmember));
                    } else {
                        // The request has succeeded.
                        $scope.messages = 'The clubmember has been deleted ';
                        $scope.alertStatus = 'success';
                        $scope.submitted = false;
                        $scope.clubmember = {};
                        $log.info($scope.messages + ' : ' + JSON.stringify(resp.result));
                        $route.reload();
                    }
                });
            });
        }
        deleteClubmember();
    };
});

/**
 * @ngdoc controller
     * @name detailedClubmemberCtrl
 *
 * @surname
 * A controller used to save a clubmember page.
 */
ClubManagementApp.controllers.controller('detailedClubmemberCtrl', function ($scope, $log, $location, $timeout, $route, $uibModal, $routeParams, parentProvider, HTTP_ERRORS) {

    $scope.clubmember = {};
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

    $scope.deleteClubmember = function (clubmemberForm) {
        var deleteClubmember = function() {
            $scope.loading = true;
            $scope.submitted = true;
            gapi.client.clubmanagement.deleteClubmember({websafeClubmemberKey: $routeParams.websafeClubmemberKey})
            .execute(function (resp) {
                $scope.$apply(function () {
                    $scope.loading = false;
                    if (resp.error) {
                        var errorMessage = resp.error.message || '';
                        $scope.messages = 'Failed to delete clubmember : ' + errorMessage;
                        $scope.alertStatus = 'warning';
                        $log.error($scope.messages + ' Clubmember : ' + JSON.stringify($scope.clubmember));
                        $route.reload();
                    } else {
                        $scope.messages = 'The clubmember has been deleted ';
                        $scope.alertStatus = 'success';
                        $scope.submitted = false;
                        $scope.clubmember = {};
                        $log.info($scope.messages + ' : ' + JSON.stringify(resp.result));
                        $timeout(function () {
                            $location.path('/clubmembers');
                            $route.reload();
                        });
                    }
                });
            });
        }
    };

    $scope.init = function () {
        var getClubmember = function() {
            $scope.loading = true;
            $scope.submitted = true;
            gapi.client.clubmanagement.getClubmember({websafeClubmemberKey: $routeParams.websafeClubmemberKey}).execute(function (resp) {
                $scope.$apply(function () {
                    $scope.loading = false;
                    if (resp.error) {
                        var errorMessage = resp.error.message || '';
                        $scope.messages = 'Failed to get the clubmember : ' + $routeParams.websafeClubmemberKey  + ' ' + errorMessage;
                        $scope.alertStatus = 'warning';
                        $log.error($scope.messages);
                    } else {
                        $scope.submitted = false;
                        $scope.alertStatus = 'success';
                        $scope.clubmember = resp.result;
                        parentProvider.clubmember = $scope.clubmember;
                        if ($scope.clubmember == null) { $scope.clubmember = []; }
                    }
                });
            });
        }
        getClubmember();
    };
});

/**
 * @ngdoc controller
 * @name createClubmemberCtrl
 *
 * @surname
 * A controller used to save a clubmember page.
 */
ClubManagementApp.controllers.controller('createClubmemberCtrl', function ($scope, $log, $location, $routeParams, HTTP_ERRORS) {

    $scope.clubmember = {};

    // Initialize the controller
    $scope.init = function () {
        console.log("Init Clubmembers")
        var retrieveTeamsCallback = function () {
            console.log("finally");
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

                            $log.error($scope.messages);

                        } else {
                            // The request has succeeded.
                            $scope.submitted = false;
                            $scope.messages = 'Query succeeded';
                            $scope.alertStatus = 'success';
                            $log.info($scope.messages);
                            $scope.Teams = resp.items;
                            console.log("Teams from DB: " + JSON.stringify(resp.items));
                            $scope.teams = [];
                            $scope.Teams.forEach(function (element) {
                            $scope.teams.push(element.name);
                            //parentProvider.teams = $scope.teams;
                            });

                            $scope.teams.sort();
                            $scope.filteredTeams = $scope.teams;
                            console.log("retrieve: ", JSON.stringify($scope.teams));
                        }
                        $scope.name = "Team Name";
                        if ($scope.teams.length > 0) {
                            $scope.createClubmember.team = $scope.teams[0];
                        }
                        $scope.submitted = true;
                    });
                });
        };

        retrieveTeamsCallback();
    };

    // Set focus on the name input element
    document.getElementById("name").focus();

    // Check if the form is valid
    $scope.isValidClubmember = function (clubmemberForm) {
        return !clubmemberForm.$invalid;
    };

    // Create a new clubmember
    $scope.createClubmember = function (clubmemberForm) {
        if (!$scope.isValidClubmember(clubmemberForm)) {
            return;
        }

        var createClubmember = function () {
            $scope.loading = true;
            console.log("create: ", JSON.stringify($scope.clubmember));
            gapi.client.clubmanagement.createClubmember($scope.clubmember).
                execute(function (resp) {
                    $scope.$apply(function () {
                        $scope.loading = false;
                        if (resp.error) {
                            // The request has failed.
                            var errorMessage = resp.error.message || '';
                            $scope.messages = 'Failed to save a clubmember : ' + errorMessage;
                            $scope.alertStatus = 'warning';
                            $log.error($scope.messages + ' Clubmember : ' + JSON.stringify($scope.clubmember));
                            $scope.messages = 'The clubmember has been saved : ' + resp.result.name;
                            $scope.alertStatus = 'success';
                            $scope.submitted = false;
                            $scope.clubmember = {};
                            $log.info($scope.messages + ' : ' + JSON.stringify(resp.result));
                        }
                    });
                });
        };
            createClubmember();

        document.getElementById("name").focus();
    };
});





/**
 * @ngdoc controller
 * @name saveClubmemberCtrl
 *
 * @surname
 * A controller used to save a clubmember page.
 */
ClubManagementApp.controllers.controller('saveClubmemberCtrl', function ($scope, $log, $location, $route, $routeParams, HTTP_ERRORS) {

    $scope.clubmember = {};
    $scope.createMatch = {}; // Ensure createMatch is defined to prevent errors

    $scope.init = function () {
        console.log("Init Clubmember");

        var getClubmember = function () {
            $scope.loading = true;
            gapi.client.clubmanagement.getClubmember({ websafeClubmemberKey: $routeParams.websafeClubmemberKey })
                .execute(function (resp) {
                    $scope.$apply(function () {
                        $scope.loading = false;
                        if (resp.error) {
                            var errorMessage = resp.error.message || '';
                            $scope.messages = 'Failed to get the clubmember: ' + $routeParams.websafeClubmemberKey + ' ' + errorMessage;
                            $scope.alertStatus = 'warning';
                            $log.error($scope.messages);
                        } else {
                            $scope.alertStatus = 'success';
                            $scope.clubmember = resp.result;
                        }
                    });
                });
        };

        var retrieveTeamsCallback = function () {
            console.log("Fetching teams");
            $scope.loading = true;
            gapi.client.clubmanagement.getTeams()
                .execute(function (resp) {
                    $scope.$apply(function () {
                        $scope.loading = false;
                        if (resp.error) {
                            var errorMessage = resp.error.message || '';
                            $scope.messages = 'Failed to obtain teams: ' + errorMessage;
                            $scope.alertStatus = 'warning';
                            $log.error($scope.messages);
                        } else {
                            $scope.submitted = false;
                            $scope.messages = 'Query succeeded';
                            $scope.alertStatus = 'success';
                            $log.info($scope.messages);
                            $scope.Teams = resp.items || [];
                            console.log("Teams from DB: ", JSON.stringify(resp.items));

                            $scope.teams = $scope.Teams.map(element => element.name).sort();
                            $scope.filteredTeams = $scope.teams;

                            console.log("Retrieved teams: ", JSON.stringify($scope.teams));

                            if ($scope.teams.length > 0) {
                                $scope.createMatch.team = $scope.teams[0];
                            }
                        }
                        $scope.submitted = true;
                    });
                });
        };

        getClubmember();
        retrieveTeamsCallback();
    };

    $scope.isValidClubmember = function (clubmemberForm) {
        return !clubmemberForm.$invalid;
    };

    $scope.saveClubmember = function (clubmemberForm) {
        if (!$scope.isValidClubmember(clubmemberForm)) {
            return;
        }

        $scope.submitted = true;
        $scope.loading = true;

        gapi.client.clubmanagement.saveClubmember($scope.clubmember)
            .execute(function (resp) {
                $scope.$apply(function () {
                    $scope.loading = false;
                    if (resp.error) {
                        var errorMessage = resp.error.message || '';
                        $scope.messages = 'Failed to save clubmember: ' + errorMessage;
                        $scope.alertStatus = 'warning';
                        $log.error($scope.messages + ' Clubmember: ' + JSON.stringify($scope.clubmember));
                    } else {
                        $scope.messages = 'The clubmember has been saved: ' + resp.result.name;
                        $scope.alertStatus = 'success';
                        $scope.submitted = false;
                        $scope.clubmember = {};
                        $log.info($scope.messages + ' : ' + JSON.stringify(resp.result));
                        window.history.back();
                    }
                });
            });
    };

});