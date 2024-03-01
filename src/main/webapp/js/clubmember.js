/**
 * @ngdoc controller
 * @name getClubmemberCtrl
 *
 * @surname
 * A controller used to save a clubmember page.
 */
ClubManagementApp.controllers.controller('getClubmembersCtrl', function ($scope, $log, $location, $route, oauth2Provider, parentProvider, $routeParams, $uibModal, HTTP_ERRORS) {

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
        $scope.filteredClubmembers = [];
        $scope.clubmembers.forEach(function(element) {
            let nameToSearch = element.name.toLowerCase();
            let surnameToSearch = element.surname.toLowerCase();
            let searchString = search_field.toLowerCase();
            if (nameToSearch.includes(searchString) || surname.includes(searchString)){
                $scope.filteredClubmembers.push(element);
            }
        });
        $scope.pagination.currentPage = 0;
    }

    $scope.init = function () {
        var retrieveClubmembersCallback = function () {
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
                            parentProvider.clubmembers = $scope.clubmembers;
                        }
                        $scope.submitted = true;
                    });
                }
            );
        };
        if (!oauth2Provider.signedIn) {
            oauth2Provider.signIn(retrieveClubmembersCallback);
        } else {
            retrieveClubmembersCallback();
        }
    };

    $scope.deleteClubmemberWithWebsafeClubmemberKey = function (websafeClubmemberKey) {
        var callback = function() {
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
                        if (resp.code && resp.code == HTTP_ERRORS.UNAUTHORIZED) {
                            oauth2Provider.signIn();//   oauth2Provider.showLoginModal();
                            return;
                        }
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
        if (!oauth2Provider.signedIn) {
            oauth2Provider.signIn(callback);
        } else {
            callback();
        }
    };
});

/**
 * @ngdoc controller
     * @name detailedClubmemberCtrl
 *
 * @surname
 * A controller used to save a clubmember page.
 */
ClubManagementApp.controllers.controller('detailedClubmemberCtrl', function ($scope, $log, $location, $timeout, $route, $uibModal, $routeParams, oauth2Provider, parentProvider, HTTP_ERRORS) {

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

    $scope.getSignedInState = function () {
        return oauth2Provider.signedIn;
    };

    $scope.collapseNavbar = function () {
        angular.element(document.querySelector('.navbar-collapse')).removeClass('in');
    };

    $scope.deleteClubmember = function (clubmemberForm) {
        var callback = function() {
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
                        if (resp.code && resp.code == HTTP_ERRORS.UNAUTHORIZED) {
                            oauth2Provider.signIn();//   showLoginModal();
                            return;
                        }
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
        if (!oauth2Provider.signedIn) {
            oauth2Provider.signIn(callback);
        } else {
            callback();
        }
    };
});

/**
 * @ngdoc controller
 * @name createClubmemberCtrl
 *
 * @surname
 * A controller used to save a clubmember page.
 */
ClubManagementApp.controllers.controller('createClubmemberCtrl', function ($scope, $log, $location, oauth2Provider, $routeParams, HTTP_ERRORS) {

    $scope.clubmember = {};

    document.getElementById("name").focus();

    $scope.isValidClubmember = function (clubmemberForm) {
        return !clubmemberForm.$invalid;
    }

    $scope.createClubmember = function (clubmemberForm) {
        if (!$scope.isValidClubmember(clubmemberForm)) {
            return;
        }

        var callback = function() {
            $scope.loading = true;
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
                        if (resp.code && resp.code == HTTP_ERRORS.UNAUTHORIZED) {
                            oauth2Provider.signIn();//   oauth2Provider.showLoginModal();
                            return;
                        }
                    } else {
                        // The request has succeeded.
                        $scope.messages = 'The clubmember has been saved : ' + resp.result.name;
                        $scope.alertStatus = 'success';
                        $scope.submitted = false;
                        $scope.clubmember = {};
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
 * @name saveClubmemberCtrl
 *
 * @surname
 * A controller used to save a clubmember page.
 */
ClubManagementApp.controllers.controller('saveClubmemberCtrl', function ($scope, $log, $location, $route, oauth2Provider, $routeParams, HTTP_ERRORS) {

    $scope.clubmember = {};

    $scope.init = function () {
        var callback = function() {
            $scope.loading = true;
            gapi.client.clubmanagement.getClubmember({websafeClubmemberKey: $routeParams.websafeClubmemberKey
            }).execute(function (resp) {
                $scope.$apply(function () {
                    $scope.loading = false;
                    if (resp.error) {
                        // The request has failed.
                        var errorMessage = resp.error.message || '';
                        $scope.messages = 'Failed to get the clubmember : ' + $routeParams.websafeClubmemberKey  + ' ' + errorMessage;
                        $scope.alertStatus = 'warning';
                        $log.error($scope.messages);
                    } else {
                        // The request has succeeded.
                        $scope.alertStatus = 'success';
                        $scope.clubmember = resp.result;
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

    $scope.isValidClubmember = function (clubmemberForm) {
        return !clubmemberForm.$invalid;
    }

    $scope.saveClubmember = function (clubmemberForm) {
         $scope.clubmember.websafeClubmemberKey = $routeParams.websafeClubmemberKey;
         if (!$scope.isValidClubmember(clubmemberForm)) {
             return;
         }

         var callback = function() {
            $scope.loading = true;
            gapi.client.clubmanagement.saveClubmember({name: $scope.clubmember.name, surname: $scope.clubmember.surname, birthDate: $scope.clubmember.birthDate, eMail: $scope.clubmember.eMail, address: $scope.clubmember.address, isCoach: $scope.clubmember.isCoach, isAdmin: $scope.clubmember.isAdmin, clubmemberKey: $routeParams.websafeClubmemberKey})
             .execute(function (resp) {
                 $scope.$apply(function () {
                    $scope.loading = false;
                     if (resp.error) {
                         var errorMessage = resp.error.message || '';
                         $scope.messages = 'Failed to save a clubmember : ' + errorMessage;
                         $scope.alertStatus = 'warning';
                         $log.error($scope.messages + ' Clubmember : ' + JSON.stringify($scope.clubmember));
                         if (resp.code && resp.code == HTTP_ERRORS.UNAUTHORIZED) {
                             oauth2Provider.signIn();//   oauth2Provider.showLoginModal();
                             return;
                         }
                         $route.reload();
                     } else {
                         $scope.messages = 'The clubmember has been saved : ' + resp.result.name;
                         $scope.alertStatus = 'success';
                         $scope.submitted = false;
                         $scope.clubmember = {};
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