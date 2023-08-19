import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  {
  constructor(public router: Router) {
    setInterval(() => {
      const a = localStorage.getItem('okta-token-storage');
      if (a) {
        try {
          const decodedToken = JSON.parse(a);
          if (Object.keys(decodedToken).length === 0) {
            window.location.reload();
          }
        } catch (error) {
          console.error('Error parsing token:', error);
        }
      }
    }, 1000);
  }

}
