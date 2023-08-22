import { Component,Inject,OnInit } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  userName:any;
  userEmail:any;
  userGroup:any=[];
  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

  public ngOnInit(): void {
    this.userName = localStorage.getItem('name');
    this.userEmail = localStorage.getItem('email');
    const userGroupJson = localStorage.getItem('group');
    if (userGroupJson !== null) {
      let a = userGroupJson.slice(1, -1);
      this.userGroup= a.split(',').map(str => str.replace(/"/g, ''));
    }
  }

  public async signOut(): Promise<void> {
    await this.oktaAuth.signOut();
  }
}
