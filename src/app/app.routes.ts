import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { ImprintComponent } from './legal/imprint/imprint.component';
import { DataProtectionComponent } from './legal/data-protection/data-protection.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterComponent } from './login-page/register/register.component';
import { LoginComponent } from './login-page/login/login.component';

export const routes: Routes = [
  { path: '', component: MainPageComponent },
  {
    path: 'login',
    component: LoginPageComponent, // Die Login-Seite mit <app-login> oder <app-register>
    children: [
      { path: '', component: LoginComponent }, // Standardmäßig <app-login>
      { path: 'register', component: RegisterComponent }, // <app-register> bei /login/register
    ],
  },
  { path: 'impressum', component: ImprintComponent},
  { path: 'datenschutzerklaerung', component: DataProtectionComponent},
  { path: 'login/register', component: RegisterComponent},
];
