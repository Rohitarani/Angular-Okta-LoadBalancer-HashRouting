
export const config = {
  oidc: {
    clientId: '<id>',
    issuer: 'https://<company>.cloud/oauth2/<id>',
    redirectUri: 'http://localhost:4200',
    scopes: ['openid', 'profile', 'email'],
  }
};
