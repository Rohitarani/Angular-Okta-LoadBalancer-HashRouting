import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OktaAuthService } from './okta-auth.service';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent , canActivate: [OktaAuthService]},
  { path: '',redirectTo: 'welcome',pathMatch:'full'},
  { path: '**',redirectTo: 'welcome',pathMatch:'full'},
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
