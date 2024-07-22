export default {
    app: {
        url: 'https://localhost:8443',
    },
    oidc: {
        domain: 'dev-usnrgcejoh3hh0zu.us.auth0.com',
        clientId: 'XSx7ECfE1M5ZUeaw6WcwLqKQS0IxD7bl',
        issuer: 'https://dev-usnrgcejoh3hh0zu.us.auth0.com/',
        redirectUri: 'http://localhost:4200/login/callback',
        audience: 'http://ecommerce/api',
        scopes: ['openid', 'profil', 'email']
    },
    api: {
        url: 'http://localhost:8080/api'
    },
    error:{
        path: '/error'
    }
}