/**
 * @ngdoc controller
 * @name getDepartmentCtrl
 *
 * @description
 * A controller used to save a department page.
 */
QRcoolApp.controllers.controller('getDepartmentsCtrl', function ($scope, $log, $location, $route, oauth2Provider, parentProvider, $routeParams, $uibModal, HTTP_ERRORS) {

    document.getElementById("query-input").focus();

    $scope.submitted = false;
    $scope.loading = false;
    activeURL = '#!/departments';

    $scope.departments = [];
    $scope.filteredDepartments = [];

    $scope.pagination = $scope.pagination || {};
    $scope.pagination.currentPage = 0;
    $scope.pagination.pageSize = 25;

    $scope.pagination.numberOfPages = function () {
        return Math.ceil($scope.filteredDepartments.length / $scope.pagination.pageSize);
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

    $scope.queryDepartmentsByName = function (search_field) {
        $scope.filteredDepartments = [];
        $scope.departments.forEach(function(element) {
            let nameToSearch = element.name.toLowerCase();
            let descriptionToSearch = element.description.toLowerCase();
            let searchString = search_field.toLowerCase();
            if (nameToSearch.includes(searchString) || descriptionToSearch.includes(searchString)){
                $scope.filteredDepartments.push(element);
            }
        });
        $scope.pagination.currentPage = 0;
    }

    $scope.init = function () {
        var retrieveDepartmentsCallback = function () {
            $scope.loading = true;
            /*
            gapi.client.dutyscheduling.getDepartmentsCreated().
                execute(function (resp) {
                    $scope.$apply(function () {
                        $scope.loading = false;
                        if (resp.error) {
                            // The request has failed.
                            var errorMessage = resp.error.message || '';
                            $scope.messages = 'Failed to obtain departments : ' + errorMessage;
                            $scope.alertStatus = 'warning';
                            $log.error($scope.messages );
                        } else {
                            // The request has succeeded.
                            $scope.submitted = false;
                            $scope.messages = 'Query succeeded';
                            $scope.alertStatus = 'success';
                            $log.info($scope.messages);
                            $scope.departments = resp.items;
                            $scope.filteredDepartments = $scope.departments;
                            parentProvider.departments = $scope.departments;
                        }
                        $scope.submitted = true;
                    });
                }
            );
            */
        };
        if (!oauth2Provider.signedIn) {
            oauth2Provider.signIn(retrieveDepartmentsCallback);
        } else {
            console.log("retrieving...");
            retrieveDepartmentsCallback();
        }
    };

    $scope.deleteDepartmentWithWebsafeDepartmentKey = function (websafeDepartmentKey) {
        var callback = function() {
            $scope.loading = true;
            gapi.client.dutyscheduling.deleteDepartment({websafeDepartmentKey: websafeDepartmentKey})
            .execute(function (resp) {
                $scope.$apply(function () {
                    $scope.loading = false;
                    if (resp.error) {
                        // The request has failed.
                        var errorMessage = resp.error.message || '';
                        $scope.messages = 'Failed to delete department : ' + errorMessage;
                        $scope.alertStatus = 'warning';
                        $log.error($scope.messages + ' Department : ' + JSON.stringify($scope.department));
                        if (resp.code && resp.code == HTTP_ERRORS.UNAUTHORIZED) {
                            oauth2Provider.signIn();//   oauth2Provider.showLoginModal();
                            return;
                        }
                    } else {
                        // The request has succeeded.
                        $scope.messages = 'The department has been deleted ';
                        $scope.alertStatus = 'success';
                        $scope.submitted = false;
                        $scope.department = {};
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
 * @name detailedDepartmentCtrl
 *
 * @description
 * A controller used to save a department page.
 */
QRcoolApp.controllers.controller('detailedDepartmentCtrl', function ($scope, $log, $location, $timeout, $route, $uibModal, $routeParams, oauth2Provider, parentProvider, HTTP_ERRORS) {

    $scope.department = {};
    $scope.req = true;
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

    $scope.collapseNavbar = function () {
        angular.element(document.querySelector('.navbar-collapse')).removeClass('in');
    };

    $scope.deleteDepartment = function (departmentForm) {
        var callback = function() {
            $scope.loading = true;
            $scope.submitted = true;
            gapi.client.dutyscheduling.deleteDepartment({websafeDepartmentKey: $routeParams.websafeDepartmentKey})
            .execute(function (resp) {
                $scope.$apply(function () {
                    $scope.loading = false;
                    if (resp.error) {
                        var errorMessage = resp.error.message || '';
                        $scope.messages = 'Failed to delete department : ' + errorMessage;
                        $scope.alertStatus = 'warning';
                        $log.error($scope.messages + ' Department : ' + JSON.stringify($scope.department));
                        if (resp.code && resp.code == HTTP_ERRORS.UNAUTHORIZED) {
                            oauth2Provider.signIn();//   showLoginModal();
                            return;
                        }
                        $route.reload();
                    } else {
                        $scope.messages = 'The department has been deleted ';
                        $scope.alertStatus = 'success';
                        $scope.submitted = false;
                        $scope.department = {};
                        $log.info($scope.messages + ' : ' + JSON.stringify(resp.result));
                        $timeout(function () {
                            $location.path('/departments');
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
            gapi.client.dutyscheduling.getDepartment({websafeDepartmentKey: $routeParams.websafeDepartmentKey}).execute(function (resp) {
                $scope.$apply(function () {
                    $scope.loading = false;
                    if (resp.error) {
                        var errorMessage = resp.error.message || '';
                        $scope.messages = 'Failed to get the department : ' + $routeParams.websafeDepartmentKey  + ' ' + errorMessage;
                        $scope.alertStatus = 'warning';
                        $log.error($scope.messages);
                    } else {
                        $scope.submitted = false;
                        $scope.alertStatus = 'success';
                        $scope.department = resp.result;
                        parentProvider.department = $scope.department;

                        if ($scope.department == null) { $scope.department = []; }
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
 * @name createDepartmentCtrl
 *
 * @description
 * A controller used to save a department page.
 */
QRcoolApp.controllers.controller('createDepartmentCtrl', function ($scope, $log, $location, oauth2Provider, $routeParams, HTTP_ERRORS) {

    $scope.department = {};

    getAccountData = function () {
        var retrieveAccountCallback = function () {
            $scope.account = {};
            $scope.loading = true;
            gapi.client.dutyscheduling.getAccount().
                execute(function (resp) {
                    $scope.$apply(function () {
                        $scope.loading = false;
                        if (resp.error) {
                            // Failed to get a user account.
                            console.log(' unable to get account');
                        } else {
                            // Succeeded to get the user acount.
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

    getAccountData();

    document.getElementById("name").focus();

    $scope.isValidDepartment = function (departmentForm) {
        return !departmentForm.$invalid;
    }

    $scope.createDepartment = function (departmentForm) {
        if (!$scope.isValidDepartment(departmentForm)) {
            return;
        }

        var callback = function() {
            $scope.loading = true;
            gapi.client.dutyscheduling.createDepartment($scope.department).
            execute(function (resp) {
                $scope.$apply(function () {
                    $scope.loading = false;
                    if (resp.error) {
                        // The request has failed.
                        var errorMessage = resp.error.message || '';
                        $scope.messages = 'Failed to save a department : ' + errorMessage;
                        $scope.alertStatus = 'warning';
                        $log.error($scope.messages + ' Department : ' + JSON.stringify($scope.department));
                        if (resp.code && resp.code == HTTP_ERRORS.UNAUTHORIZED) {
                            oauth2Provider.signIn();//   oauth2Provider.showLoginModal();
                            return;
                        }
                    } else {
                        // The request has succeeded.
                        $scope.messages = 'The department has been saved : ' + resp.result.name;
                        $scope.alertStatus = 'success';
                        $scope.submitted = false;
                        $scope.department = {};
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
 * @name saveDepartmentCtrl
 *
 * @description
 * A controller used to save a department page.
 */
QRcoolApp.controllers.controller('saveDepartmentCtrl', function ($scope, $log, $location, $route, oauth2Provider, $routeParams, HTTP_ERRORS) {

    $scope.department = {};

    $scope.init = function () {
        var callback = function() {
            $scope.loading = true;
            gapi.client.dutyscheduling.getDepartment({websafeDepartmentKey: $routeParams.websafeDepartmentKey
            }).execute(function (resp) {
                $scope.$apply(function () {
                    $scope.loading = false;
                    if (resp.error) {
                        // The request has failed.
                        var errorMessage = resp.error.message || '';
                        $scope.messages = 'Failed to get the department : ' + $routeParams.websafeDepartmentKey  + ' ' + errorMessage;
                        $scope.alertStatus = 'warning';
                        $log.error($scope.messages);
                    } else {
                        // The request has succeeded.
                        $scope.alertStatus = 'success';
                        $scope.department = resp.result;
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

    $scope.isValidDepartment = function (departmentForm) {
        return !departmentForm.$invalid;
    }

    $scope.saveDepartment = function (departmentForm) {
         $scope.department.websafeDepartmentKey = $routeParams.websafeDepartmentKey;
         if (!$scope.isValidDepartment(departmentForm)) {
             return;
         }

         var callback = function() {
            $scope.loading = true;
            gapi.client.dutyscheduling.saveDepartment({name: $scope.department.name, description: $scope.department.description, departmentKey: $routeParams.websafeDepartmentKey})
             .execute(function (resp) {
                 $scope.$apply(function () {
                    $scope.loading = false;
                     if (resp.error) {
                         var errorMessage = resp.error.message || '';
                         $scope.messages = 'Failed to save a department : ' + errorMessage;
                         $scope.alertStatus = 'warning';
                         $log.error($scope.messages + ' Department : ' + JSON.stringify($scope.department));
                         if (resp.code && resp.code == HTTP_ERRORS.UNAUTHORIZED) {
                             oauth2Provider.signIn();//   oauth2Provider.showLoginModal();
                             return;
                         }
                         $route.reload();
                     } else {
                         $scope.messages = 'The department has been saved : ' + resp.result.name;
                         $scope.alertStatus = 'success';
                         $scope.submitted = false;
                         $scope.department = {};
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