// this
// https://developers.google.com/identity/gsi/web/reference/js-reference
// https://overclocked.medium.com/seamless-api-access-with-google-identity-services-b9901009a8ce
// https://developers.google.com/identity/oauth2/web/guides/use-token-model#initialize_a_token_client
// https://stackoverflow.com/questions/71393557/how-to-use-sign-in-with-google-together-with-tokenclient
// https://developers.google.com/identity/oauth2/web/guides/use-token-model
// probably not this (just for reference)
// https://developers.google.com/identity/oauth2/web/guides/migration-to-gis#gapi-client-library

function handleCredentialResponse(response) {
        const responsePayload = decodeJwtResponse(response.credential);
        const login = new Promise((res,rej) => {
            const token_client = google.accounts.oauth2.initTokenClient({
                client_id: GOOGLE_APP_ENGINE_CLIENT_ID,
                scope: "https://www.googleapis.com/auth/userinfo.email",
                hint: responsePayload.email,
                callback: (response) => {
                    if (!response.access_token) {
                        alert("Unauthorized (user unknown) - access denied. Please contact an administrator")
                        return rej('authorization-failed');
                    }
                    res();
                }
            });
            token_client.requestAccessToken({prompt: ''});
        })

        login.then(() => {
            var $scope = angular.element('[ng-controller=RootCtrl]').scope();
            $scope.userEmail = responsePayload.email
            clubmemberExists();
        });

    var clubmemberExists = function() {
        var $scope = angular.element('[ng-controller=RootCtrl]').scope();
        gapi.client.clubmanagement.clubmemberExists({clubmemberEmail: $scope.userEmail}).execute(function (resp) {
            $scope.$apply(function () {
                if (resp.error) {
                    // The request has failed.
                    var errorMessage = resp.error.message || '';
                } else {
                    // The request has succeeded.
                    if (resp.result.id != null) { // id present means: account exists
                        $scope.clubmember = resp.result
                        $scope.grantSignIn();
                    } else {
                        $scope.denySignIn();
                        alert("Unauthorized - Access Denied. Please Call an Administrator")
                    }
                }
            });
        });
    }
}

function decodeJwtResponse (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function initGSI() {
    console.log("initGSI... ")
    // deletes cookie(s) in particular g_state cookie
    // Source: https://stackoverflow.com/questions/62281579/google-one-tap-sign-in-ui-not-displayed-after-clicking-the-close-button
    document.cookie =  `g_state=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT`;
    google.accounts.id.initialize({
        client_id: GOOGLE_APP_ENGINE_CLIENT_ID,
        auto_select: true,
        callback: handleCredentialResponse
    });
    google.accounts.id.prompt((notification) => {
        if (notification.isSkippedMoment()) {
            alert("Cancelled by User - Access Denied. Refresh this page to override.");
            var $scope = angular.element('[ng-controller=RootCtrl]').scope();
            $scope.denySignIn();
        }
    });
}

function initGAPI() {
    gapi.client.load('clubmanagement', 'v1', null, '//' + window.location.host + '/_ah/api');
    angular.bootstrap(document, ['ClubManagementApp']);

    var $scope = angular.element('[ng-controller=RootCtrl]').scope();
    $scope.$apply(function() {$scope.denySignIn()});
}