import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { ImprintComponent } from './legal/imprint/imprint.component';
import { DataProtectionComponent } from './legal/data-protection/data-protection.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterComponent } from './login-page/register/register.component';
import { LoginComponent } from './login-page/login/login.component';
import { SelectAvatarComponent } from './login-page/select-avatar/select-avatar.component';
import { ResetPasswordComponent } from './login-page/reset-password/reset-password.component';
import { ChangePasswordComponent } from './login-page/change-password/change-password.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'main', component: MainPageComponent }, //  canActivate: [authGuard] <<<<< das hier hinter MainPageComponent, packen für guard aktivieren

  {
    path: 'login',
    component: LoginPageComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'avatar/:userId', component: SelectAvatarComponent },
      { path: 'resetpw', component: ResetPasswordComponent },
      { path: 'changepw', component: ChangePasswordComponent },
    ],
  },
  { path: 'impressum', component: ImprintComponent },
  { path: 'datenschutzerklaerung', component: DataProtectionComponent },
  { path: 'login/register', component: RegisterComponent },
];
