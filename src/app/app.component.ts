import { Component,HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Okta-HashRouting-LoadBalancer';
  isAuthenticated:boolean=false;
  @HostListener('window:click', ['$event'])
  @HostListener('window:mousemove', ['$event'])

  onWindowClick(event: MouseEvent) {
    if (!localStorage.getItem('userGroup')) {
      window.location.reload();
    }
  }
}
