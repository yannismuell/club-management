# Managing COOL-Classes

This procect comprises both web front- and backend for a duty scheduling SaaS application hosted on Google Cloud Platform.

ToDo: 

Frameworks used:

- [Google App Engine Standard][1]

- [Java][2]

- [Google Cloud Endpoints Frameworks v2.0][8]
- [Google Cloud Endpoints Frameworks v1.0][3]

- [Google App Engine Maven plugin][14]
- [Google App Engine Gradle plugin][15]

- [Google Cloud Endpoints Frameworks Maven Plugin][10]
- [Google Cloud Endpoints Frameworks Gradle Plugin][11]

1. User Authenticating with Google Accounts in Web Clients

    1. Updated the `WEB_CLIENT_ID` in [Constants.java](src/main/webapp/js/app.js)
      to reflect the web client ID registered in the
      [Credentials on Developers Console for OAuth 2.0 client IDs][6].

    1. Updated the value of `com.perceptronics` in
       (src/main/java.com/qrcool/Constants) to reflect the web client ID registered in the
       [Credentials on Developers Console for OAuth 2.0 client IDs][6].

1. User Authenticating with Google Accounts in other Applications
   Types

    - Inside [Constants.java](src/main/java/com/qrcool/Constants.java)
      you will find placeholders for Android applications using Google Accounts
      client IDs registered in the
      [Credentials on Developers Console for OAuth 2.0 client IDs][6].

    - Note: iOS support should work but has not been fully tested.

    - More about different user authentication supported [here][12].


[1]: https://cloud.google.com/appengine/docs/java/
[2]: http://java.com/en/
[3]: https://cloud.google.com/endpoints/docs/frameworks/legacy/v1/java
[4]: https://cloud.google.com/appengine/docs/java/tools/maven
[5]: http://localhost:8080/
[6]: https://console.developers.google.com/project/_/apiui/credential
[7]: https://cloud.google.com/endpoints/docs/frameworks/legacy/v1/java/migrating
[8]: https://cloud.google.com/endpoints/docs/frameworks/java/about-cloud-endpoints-frameworks
[9]: https://cloud.google.com/endpoints/docs/frameworks/java/quickstart-frameworks-java
[10]: https://github.com/GoogleCloudPlatform/endpoints-framework-maven-plugin
[11]: https://github.com/GoogleCloudPlatform/endpoints-framework-gradle-plugin
[12]: https://cloud.google.com/endpoints/docs/authenticating-users-frameworks
[13]: http://localhost:8080/_ah/api/explorer
[14]: https://github.com/GoogleCloudPlatform/app-maven-plugin
[15]: https://github.com/GoogleCloudPlatform/app-gradle-plugin

#ClubManagement
