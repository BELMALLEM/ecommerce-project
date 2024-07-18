export default {
    app: {
        url: 'http://localhost:4200',
    },
    oidc: {
        domain: 'dev-usnrgcejoh3hh0zu.us.auth0.com',
        clientId: 'XSx7ECfE1M5ZUeaw6WcwLqKQS0IxD7bl',
        redirectUri: 'http://localhost:4200/login/callback',
        scopes: ['openid', 'profil', 'email']
    },
    api: {
        url: 'http://localhost:8080/api'
    },
    error:{
        path: '/error'
    }
}