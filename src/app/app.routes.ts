import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { LoginComponent } from './login-page/login/login.component';
import { SingleUserComponent } from './main-page/single-user/single-user.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: MainPageComponent },

    { path: 'single-user', component: SingleUserComponent },
];
