import { Component } from '@angular/core';
import { LoginPageComponent } from "./login-page/login-page.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'dabubble';
}
