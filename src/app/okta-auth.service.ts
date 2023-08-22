import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { OktaAuth } from '@okta/okta-auth-js';
import { OKTA_AUTH } from '@okta/okta-angular';
import {config} from './app.config';
@Injectable({
  providedIn: 'root'
})
export class OktaAuthService implements CanActivate {

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const idToken = await this.oktaAuth.tokenManager.get('idToken');

    if (idToken) {
      console.log(localStorage)
      const isExpired = await this.checkTokenExpiry();
      if (!isExpired) {
        return true;
      } else {
        await this.signOut();
        return false;
      }
    } else {
      return this.addToken();
    }
  }

  async addToken(): Promise<boolean> {
    try {
      const tokens = await this.oktaAuth.token.parseFromUrl();
      const idToken = tokens.tokens.idToken;

      if (idToken) {
        console.log(idToken.claims);
        localStorage.setItem('name', idToken.claims.name ?? '');
        localStorage.setItem('email', idToken.claims.email ?? '');
        localStorage.setItem('group', JSON.stringify(idToken.claims['groups']) || '');

        this.oktaAuth.tokenManager.add('idToken', idToken);
        return true;
      } else {
        await this.signIn();
        return false;
      }
    } catch (error) {
      await this.signIn();
      return false;
    }
  }

  async signIn(): Promise<void> {
    const authenticated = await this.oktaAuth.tokenManager.get('idToken');

    if (!authenticated) {
      sessionStorage.setItem('okta-app-url', config.oidc.redirectUri);
      this.oktaAuth.token.getWithRedirect({
        scopes: ['openid', 'email', 'profile'],
        responseMode: 'query',
        responseType: 'token'
      });
    }
  }

  async checkTokenExpiry(): Promise<boolean> {
    const authenticated = await this.oktaAuth.tokenManager.get('idToken');
    const currentTimeMs = new Date().getTime();

    return authenticated.expiresAt > currentTimeMs;
  }

  async signOut(): Promise<void> {
    await this.oktaAuth.signOut();
  }
}
