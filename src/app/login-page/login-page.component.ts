import { Component } from '@angular/core';
import { AnimationScreenComponent } from "./animation-screen/animation-screen.component";
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { BlueNotificationBoxComponent } from '../shared/blue-notification-box/blue-notification-box.component';
import { GlobalVariablesService } from '../shared/services/global-variables.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [AnimationScreenComponent, RouterLink, RouterOutlet, BlueNotificationBoxComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  notificationMessage: string = '';
  notificationVisible: boolean = false;
  currentUrl: string = '';

  constructor(public global: GlobalVariablesService, public router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    })
  }

  showNotification(message: string): void {
    this.notificationMessage = message;
    this.notificationVisible = true;

    // Automatisches Ausblenden nach 3 Sekunden
    setTimeout(() => {
      this.notificationVisible = false;
    }, 3000);
  }

  onActivate(component: any): void {
    if (component.notification) {
      component.notification.subscribe((message: string) => {
        this.showNotification(message);
      })
    }
  }
}
