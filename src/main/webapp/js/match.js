/**
 * @ngdoc controller
 * @matchDate getMatchCtrl
 *
 * @matchTime
 * A controller used to save a match page.
 */
ClubManagementApp.controllers.controller('getMatchesCtrl', function ($scope, $log, $location, $route, oauth2Provider, parentProvider, $routeParams, $uibModal, HTTP_ERRORS) {

    document.getElementById("query-input").focus();

    $scope.submitted = false;
    $scope.loading = false;
    activeURL = '#!/matches';

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
        var retrieveMatches = function () {
            $scope.loading = true;
            gapi.client.clubmanagement.getMatches().
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
        if (!oauth2Provider.signedIn) {
            oauth2Provider.signIn(retrieveMatches);
        } else {
            retrieveMatches();
        }
    };

    $scope.deleteMatchWithWebsafeMatchKey = function (websafeMatchKey) {
        var deleteMatch = function() {
            $scope.loading = true;
            gapi.client.clubmanagement.deleteMatch({websafeMatchKey: websafeMatchKey})
            .execute(function (resp) {
                $scope.$apply(function () {
                    $scope.loading = false;
                    if (resp.error) {
                        // The request has failed.
                        var errorMessage = resp.error.message || '';
                        $scope.messages = 'Failed to delete match : ' + errorMessage;
                        $scope.alertStatus = 'warning';
                        $log.error($scope.messages + ' Match : ' + JSON.stringify($scope.match));
                        if (resp.code && resp.code == HTTP_ERRORS.UNAUTHORIZED) {
                            oauth2Provider.signIn();//   oauth2Provider.showLoginModal();
                            return;
                        }
                    } else {
                        // The request has succeeded.
                        $scope.messages = 'The match has been deleted ';
                        $scope.alertStatus = 'success';
                        $scope.submitted = false;
                        $scope.match = {};
                        $log.info($scope.messages + ' : ' + JSON.stringify(resp.result));
                        $route.reload();
                    }
                });
            });
        }
        if (!oauth2Provider.signedIn) {
            oauth2Provider.signIn(deleteMatch);
        } else {
            deleteMatch();
        }
    };
});

/**
 * @ngdoc controller
 * @matchDate detailedMatchCtrl
 *
 * @matchTime
 * A controller used to save a match page.
 */
ClubManagementApp.controllers.controller('detailedMatchCtrl', function ($scope, $log, $location, $timeout, $route, $uibModal, $routeParams, oauth2Provider, parentProvider, HTTP_ERRORS) {

    $scope.match = {};
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

    $scope.getSignedInState = function () {
        return oauth2Provider.signedIn;
    };

    $scope.collapseNavbar = function () {
        angular.element(document.querySelector('.navbar-collapse')).removeClass('in');
    };

    $scope.deleteMatch = function (matchForm) {
        var deleteMatch = function() {
            $scope.loading = true;
            $scope.submitted = true;
            gapi.client.clubmanagement.deleteMatch({websafeMatchKey: $routeParams.websafeMatchKey})
            .execute(function (resp) {
                $scope.$apply(function () {
                    $scope.loading = false;
                    if (resp.error) {
                        var errorMessage = resp.error.message || '';
                        $scope.messages = 'Failed to delete match : ' + errorMessage;
                        $scope.alertStatus = 'warning';
                        $log.error($scope.messages + ' Match : ' + JSON.stringify($scope.match));
                        if (resp.code && resp.code == HTTP_ERRORS.UNAUTHORIZED) {
                            oauth2Provider.signIn();//   showLoginModal();
                            return;
                        }
                        $route.reload();
                    } else {
                        $scope.messages = 'The match has been deleted ';
                        $scope.alertStatus = 'success';
                        $scope.submitted = false;
                        $scope.match = {};
                        $log.info($scope.messages + ' : ' + JSON.stringify(resp.result));
                        $timeout(function () {
                            $location.path('/matches');
                            $route.reload();
                        });
                    }
                });
            });
        }
        if (!oauth2Provider.signedIn) {
            oauth2Provider.signIn(deleteMatch);
        } else {
            deleteMatch();
        }
    };

    $scope.init = function () {
        var getMatch = function() {
            $scope.loading = true;
            $scope.submitted = true;
            gapi.client.clubmanagement.getMatch({websafeMatchKey: $routeParams.websafeMatchKey}).execute(function (resp) {
                $scope.$apply(function () {
                    $scope.loading = false;
                    if (resp.error) {
                        var errorMessage = resp.error.message || '';
                        $scope.messages = 'Failed to get the match : ' + $routeParams.websafeMatchKey  + ' ' + errorMessage;
                        $scope.alertStatus = 'warning';
                        $log.error($scope.messages);
                    } else {
                        $scope.submitted = false;
                        $scope.alertStatus = 'success';
                        $scope.match = resp.result;
                        parentProvider.match = $scope.match;
                        if ($scope.match == null) { $scope.match = []; }
                    }
                });
            });
        }
        if (!oauth2Provider.signedIn) {
            oauth2Provider.signIn(getMatch);
        } else {
            getMatch();
        }
    };
});

/**
 * @ngdoc controller
 * @matchDate createMatchCtrl
 *
 * @matchTime
 * A controller used to save a match page.
 */
ClubManagementApp.controllers.controller('createMatchCtrl', function ($scope, $log, $location, oauth2Provider, $routeParams, HTTP_ERRORS) {

    $scope.match = {};

    document.getElementById("matchDate").focus();

    $scope.isValidMatch = function (matchForm) {
        return !matchForm.$invalid;
    }

    $scope.createMatch = function (matchForm) {
        if (!$scope.isValidMatch(matchForm)) {
            return;
        }

        var createMatch = function() {
            $scope.loading = true;
            //console.log("create: ", JSON.stringify($scope.match);
            gapi.client.clubmanagement.createMatch($scope.match).
            execute(function (resp) {
                $scope.$apply(function () {
                    $scope.loading = false;
                    if (resp.error) {
                        // The request has failed.
                        var errorMessage = resp.error.message || '';
                        $scope.messages = 'Failed to save a match : ' + errorMessage;
                        $scope.alertStatus = 'warning';
                        $log.error($scope.messages + ' Match : ' + JSON.stringify($scope.match));
                        if (resp.code && resp.code == HTTP_ERRORS.UNAUTHORIZED) {
                            oauth2Provider.signIn();//   oauth2Provider.showLoginModal();
                            return;
                        }
                    } else {
                        // The request has succeeded.
                        $scope.messages = 'The match has been saved : ' + resp.result.matchDate;
                        $scope.alertStatus = 'success';
                        $scope.submitted = false;
                        $scope.match = {};
                        $log.info($scope.messages + ' : ' + JSON.stringify(resp.result));
                    }
                });
            });
        }
        if (!oauth2Provider.signedIn) {
            oauth2Provider.signIn(createMatch);
        } else {
            createMatch();
        }

        document.getElementById("matchDate").focus();
    };

    $scope.init = function () {
        if (!oauth2Provider.signedIn) {
            oauth2Provider.signIn(); //var modalInstance = oauth2Provider.showLoginModal();
        }
    };
});

/**
 * @ngdoc controller
 * @matchDate saveMatchCtrl
 *
 * @matchTime
 * A controller used to save a match page.
 */
ClubManagementApp.controllers.controller('saveMatchCtrl', function ($scope, $log, $location, $route, oauth2Provider, $routeParams, HTTP_ERRORS) {

    $scope.match = {};

    $scope.init = function () {
        var getMatch = function() {
            $scope.loading = true;
            gapi.client.clubmanagement.getMatch({websafeMatchKey: $routeParams.websafeMatchKey
            }).execute(function (resp) {
                $scope.$apply(function () {
                    $scope.loading = false;
                    if (resp.error) {
                        // The request has failed.
                        var errorMessage = resp.error.message || '';
                        $scope.messages = 'Failed to get the match : ' + $routeParams.websafeMatchKey  + ' ' + errorMessage;
                        $scope.alertStatus = 'warning';
                        $log.error($scope.messages);
                    } else {
                        // The request has succeeded.
                        $scope.alertStatus = 'success';
                        $scope.match = resp.result;
                    }
                });
            });
        }
        if (!oauth2Provider.signedIn) {
            oauth2Provider.signIn(getMatch);
        } else {
            getMatch();
        }
    };

    $scope.isValidMatch = function (matchForm) {
             return !matchForm.$invalid;
         }

    $scope.saveMatch = function (matchForm) {
         $scope.match.websafeMatchKey = $routeParams.websafeMatchKey;
         if (!$scope.isValidMatch(matchForm)) {
             return;
         }

         var saveMatch = function() {
            $scope.loading = true;
            gapi.client.clubmanagement.saveMatch($scope.match)
             .execute(function (resp) {
                 $scope.$apply(function () {
                    $scope.loading = false;
                     if (resp.error) {
                         var errorMessage = resp.error.message || '';
                         $scope.messages = 'Failed to save a match : ' + errorMessage;
                         $scope.alertStatus = 'warning';
                         $log.error($scope.messages + ' Match : ' + JSON.stringify($scope.match));
                         if (resp.code && resp.code == HTTP_ERRORS.UNAUTHORIZED) {
                             oauth2Provider.signIn();//   oauth2Provider.showLoginModal();
                             return;
                         }
                         $route.reload();
                     } else {
                         $scope.messages = 'The match has been saved : ' + resp.result.matchDate;
                         $scope.alertStatus = 'success';
                         $scope.submitted = false;
                         $scope.match = {};
                         $log.info($scope.messages + ' : ' + JSON.stringify(resp.result));
                         window.history.back();
                     }
                 });
             });
         }
         if (!oauth2Provider.signedIn) {
             oauth2Provider.signIn(saveMatch);
         } else {
             saveMatch();
         }
    };
});