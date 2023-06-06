import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { OktaAuth } from '@okta/okta-auth-js';
import { OKTA_AUTH } from '@okta/okta-angular';
import {config} from './app.config';
@Injectable({
  providedIn: 'root'
})

export class OktaAuthService implements CanActivate {

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const idToken = await this.oktaAuth.tokenManager.get('idToken');
    if (idToken !== undefined) {
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

  addToken() {
    return this.oktaAuth.token.parseFromUrl().then(tokens => {
      if (tokens.tokens.idToken) {
        console.log(tokens.tokens.idToken.claims);
        localStorage.setItem('name',tokens.tokens.idToken.claims.name ?? '')
        localStorage.setItem('email',tokens.tokens.idToken.claims.email ?? '')
        localStorage.setItem('group',JSON.stringify(tokens.tokens.idToken.claims['groups']) ?? '')
        this.oktaAuth.tokenManager.add("idToken", tokens.tokens.idToken);
        return true;
      }
      else{
        this.signIn();
        return false;
      }
    }).catch(error => { this.signIn(); return false; });
  }

  async signIn() {
    const authenticated = await this.oktaAuth.tokenManager.get("idToken");
    if (authenticated === undefined) {
      sessionStorage.setItem('okta-app-url', config.oidc.redirectUri);
      this.oktaAuth.token.getWithRedirect({
        scopes: ['openid', 'email', 'profile'],
        responseMode: "query",
        responseType: "token"
      });
    }
    else {
      /* 'ngOnInit' is empty */
    }
  }

  async checkTokenExpiry(){
    const authenticated = await this.oktaAuth.tokenManager.get("idToken");
    const currentTime = new Date();
    const currentTimeMs = currentTime.getTime();
    if(authenticated.expiresAt > currentTimeMs){
      return true;
    }
    else{
      return false;
    }
  }

  async signOut(): Promise<void> {
    await this.oktaAuth.signOut();
  }
}
