import { Component } from '@angular/core';
import { AnimationScreenComponent } from "./animation-screen/animation-screen.component";
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ AnimationScreenComponent, RouterLink, RouterOutlet],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

}
