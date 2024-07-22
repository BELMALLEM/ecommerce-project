// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  app: {
    url: 'https://localhost:4200',
    currency: 'USD'
  },
  api: {
    url: 'https://localhost:8443/api'
  },
  error: {
    path: '/error'
  },
  stripe: {
    key: {
      publishable: 'pk_test_51PfIW22M3hIDEZfuX5F8AdXmUPEd8vDO9AmbXUAvhm5vee7iEQMGu3Hf6lvOPam67jiJY8IEKEv134pG3rQ8XzRp000awtGADB'
    }
  },
  oidc: {
    domain: 'dev-usnrgcejoh3hh0zu.us.auth0.com',
    clientId: 'XSx7ECfE1M5ZUeaw6WcwLqKQS0IxD7bl',
    issuer: 'https://dev-usnrgcejoh3hh0zu.us.auth0.com/',
    redirectUri: 'http://localhost:4200/login/callback',
    audience: 'http://ecommerce/api',
    scopes: ['openid', 'profil', 'email']
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
