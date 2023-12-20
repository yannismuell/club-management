/**
 * @ngdoc controller
 * @name getSquadCtrl
 *
 * @description
 * A controller used to save a squad page.
 */
ClubManagementApp.controllers.controller('getSquadsCtrl', function ($scope, $log, $location, $route, oauth2Provider, parentProvider, $routeParams, $uibModal, HTTP_ERRORS) {

    document.getElementById("query-input").focus();

    $scope.submitted = false;
    $scope.loading = false;
    /*activeURL = '#!/squads';*/

    $scope.squads = [];
    $scope.filteredSquads = [];

    $scope.pagination = $scope.pagination || {};
    $scope.pagination.currentPage = 0;
    $scope.pagination.pageSize = 25;

    $scope.pagination.numberOfPages = function () {
        return Math.ceil($scope.filteredSquads.length / $scope.pagination.pageSize);
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

    $scope.querySquadsByName = function (search_field) {
        $scope.filteredSquads = [];
        $scope.squads.forEach(function(element) {
            let nameToSearch = element.name.toLowerCase();
            let descriptionToSearch = element.description.toLowerCase();
            let searchString = search_field.toLowerCase();
            if (nameToSearch.includes(searchString) || descriptionToSearch.includes(searchString)){
                $scope.filteredSquads.push(element);
            }
        });
        $scope.pagination.currentPage = 0;
    }

    $scope.init = function () {
        var retrieveSquadsCallback = function () {
            $scope.loading = true;
            gapi.client.clubmanagement.getSquadsCreated().
                execute(function (resp) {
                    $scope.$apply(function () {
                        $scope.loading = false;
                        if (resp.error) {
                            // The request has failed.
                            var errorMessage = resp.error.message || '';
                            $scope.messages = 'Failed to obtain squads : ' + errorMessage;
                            $scope.alertStatus = 'warning';
                            $log.error($scope.messages );
                        } else {
                            // The request has succeeded.
                            $scope.submitted = false;
                            $scope.messages = 'Query succeeded';
                            $scope.alertStatus = 'success';
                            $log.info($scope.messages);
                            $scope.squads = resp.items;
                            $scope.filteredSquads = $scope.squads;
                            parentProvider.squads = $scope.squads;
                        }
                        $scope.submitted = true;
                    });
                }
            );
        };
        if (!oauth2Provider.signedIn) {
            oauth2Provider.signIn(retrieveSquadsCallback);
        } else {
            retrieveSquadsCallback();
        }
    };

    $scope.deleteSquadWithWebsafeSquadKey = function (websafeSquadKey) {
        var callback = function() {
            $scope.loading = true;
            gapi.client.clubmanagement.deleteSquad({websafeSquadKey: websafeSquadKey})
            .execute(function (resp) {
                $scope.$apply(function () {
                    $scope.loading = false;
                    if (resp.error) {
                        // The request has failed.
                        var errorMessage = resp.error.message || '';
                        $scope.messages = 'Failed to delete squad : ' + errorMessage;
                        $scope.alertStatus = 'warning';
                        $log.error($scope.messages + ' Squad : ' + JSON.stringify($scope.squad));
                        if (resp.code && resp.code == HTTP_ERRORS.UNAUTHORIZED) {
                            oauth2Provider.signIn();//   oauth2Provider.showLoginModal();
                            return;
                        }
                    } else {
                        // The request has succeeded.
                        $scope.messages = 'The squad has been deleted ';
                        $scope.alertStatus = 'success';
                        $scope.submitted = false;
                        $scope.squad = {};
                        $log.info($scope.messages + ' : ' + JSON.stringify(resp.result));
                        $route.reload();
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

/**
 * @ngdoc controller
     * @name detailedSquadCtrl
 *
 * @description
 * A controller used to save a squad page.
 */
ClubManagementApp.controllers.controller('detailedSquadCtrl', function ($scope, $log, $location, $timeout, $route, $uibModal, $routeParams, oauth2Provider, parentProvider, HTTP_ERRORS) {

    $scope.squad = {};
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

    $scope.deleteSquad = function (squadForm) {
        var callback = function() {
            $scope.loading = true;
            $scope.submitted = true;
            gapi.client.clubmanagement.deleteSquad({websafeSquadKey: $routeParams.websafeSquadKey})
            .execute(function (resp) {
                $scope.$apply(function () {
                    $scope.loading = false;
                    if (resp.error) {
                        var errorMessage = resp.error.message || '';
                        $scope.messages = 'Failed to delete squad : ' + errorMessage;
                        $scope.alertStatus = 'warning';
                        $log.error($scope.messages + ' Squad : ' + JSON.stringify($scope.squad));
                        if (resp.code && resp.code == HTTP_ERRORS.UNAUTHORIZED) {
                            oauth2Provider.signIn();//   showLoginModal();
                            return;
                        }
                        $route.reload();
                    } else {
                        $scope.messages = 'The squad has been deleted ';
                        $scope.alertStatus = 'success';
                        $scope.submitted = false;
                        $scope.squad = {};
                        $log.info($scope.messages + ' : ' + JSON.stringify(resp.result));
                        $timeout(function () {
                            $location.path('/squad');
                            $route.reload();
                        });
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

    $scope.init = function () {
        var callback = function() {
            $scope.loading = true;
            $scope.submitted = true;
            gapi.client.clubmanagement.getSquad({websafeSquadKey: $routeParams.websafeSquadKey}).execute(function (resp) {
                $scope.$apply(function () {
                    $scope.loading = false;
                    if (resp.error) {
                        var errorMessage = resp.error.message || '';
                        $scope.messages = 'Failed to get the squad : ' + $routeParams.websafeSquadKey  + ' ' + errorMessage;
                        $scope.alertStatus = 'warning';
                        $log.error($scope.messages);
                    } else {
                        $scope.submitted = false;
                        $scope.alertStatus = 'success';
                        $scope.squad = resp.result;
                        parentProvider.squad = $scope.squad;

                        if ($scope.squad == null) { $scope.squad = []; }
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

/**
 * @ngdoc controller
 * @name createSquadCtrl
 *
 * @description
 * A controller used to save a squad page.
 */
ClubManagementApp.controllers.controller('createSquadCtrl', function ($scope, $log, $location, oauth2Provider, $routeParams, HTTP_ERRORS) {

    $scope.squad = {};

    document.getElementById("name").focus();

    $scope.isValidSquad = function (squadForm) {
        return !squadForm.$invalid;
    }

    $scope.createSquad = function (squadForm) {
        if (!$scope.isValidSquad(squadForm)) {
            return;
        }

        var callback = function() {
            $scope.loading = true;
            gapi.client.clubmanagement.createSquad($scope.squad).
            execute(function (resp) {
                $scope.$apply(function () {
                    $scope.loading = false;
                    if (resp.error) {
                        // The request has failed.
                        var errorMessage = resp.error.message || '';
                        $scope.messages = 'Failed to save a squad : ' + errorMessage;
                        $scope.alertStatus = 'warning';
                        $log.error($scope.messages + ' Squad : ' + JSON.stringify($scope.squad));
                        if (resp.code && resp.code == HTTP_ERRORS.UNAUTHORIZED) {
                            oauth2Provider.signIn();//   oauth2Provider.showLoginModal();
                            return;
                        }
                    } else {
                        // The request has succeeded.
                        $scope.messages = 'The squad has been saved : ' + resp.result.name;
                        $scope.alertStatus = 'success';
                        $scope.submitted = false;
                        $scope.squad = {};
                        $log.info($scope.messages + ' : ' + JSON.stringify(resp.result));
                    }
                });
            });
        }
        if (!oauth2Provider.signedIn) {
            oauth2Provider.signIn(callback);
        } else {
            callback();
        }

        document.getElementById("name").focus();
    };

    $scope.init = function () {
        if (!oauth2Provider.signedIn) {
            oauth2Provider.signIn(); //var modalInstance = oauth2Provider.showLoginModal();
        }
    };
});

/**
 * @ngdoc controller
 * @name saveSquadCtrl
 *
 * @description
 * A controller used to save a squad page.
 */
ClubManagementApp.controllers.controller('saveSquadCtrl', function ($scope, $log, $location, $route, oauth2Provider, $routeParams, HTTP_ERRORS) {

    $scope.squad = {};

    $scope.init = function () {
        var callback = function() {
            $scope.loading = true;
            gapi.client.clubmanagement.getSquad({websafeSquadKey: $routeParams.websafeSquadKey
            }).execute(function (resp) {
                $scope.$apply(function () {
                    $scope.loading = false;
                    if (resp.error) {
                        // The request has failed.
                        var errorMessage = resp.error.message || '';
                        $scope.messages = 'Failed to get the squad : ' + $routeParams.websafeSquadKey  + ' ' + errorMessage;
                        $scope.alertStatus = 'warning';
                        $log.error($scope.messages);
                    } else {
                        // The request has succeeded.
                        $scope.alertStatus = 'success';
                        $scope.squad = resp.result;
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

    $scope.isValidSquad = function (squadForm) {
        return !squadForm.$invalid;
    }

    $scope.saveSquad = function (squadForm) {
         $scope.squad.websafeSquadKey = $routeParams.websafeSquadKey;
         if (!$scope.isValidSquad(squadForm)) {
             return;
         }

         var callback = function() {
            $scope.loading = true;
            gapi.client.squad.saveSquad({name: $scope.squad.name, description: $scope.squad.description, restTime: $scope.squad.restTime, squadKey: $routeParams.websafeSquadKey})
             .execute(function (resp) {
                 $scope.$apply(function () {
                    $scope.loading = false;
                     if (resp.error) {
                         var errorMessage = resp.error.message || '';
                         $scope.messages = 'Failed to save a squad : ' + errorMessage;
                         $scope.alertStatus = 'warning';
                         $log.error($scope.messages + ' Squad : ' + JSON.stringify($scope.squad));
                         if (resp.code && resp.code == HTTP_ERRORS.UNAUTHORIZED) {
                             oauth2Provider.signIn();//   oauth2Provider.showLoginModal();
                             return;
                         }
                         $route.reload();
                     } else {
                         $scope.messages = 'The squad has been saved : ' + resp.result.name;
                         $scope.alertStatus = 'success';
                         $scope.submitted = false;
                         $scope.squad = {};
                         $log.info($scope.messages + ' : ' + JSON.stringify(resp.result));
                         window.history.back();
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