import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { LoginComponent } from './login-page/login/login.component';
import { SingleUserComponent } from './main-page/single-user/single-user.component';
import { ImprintComponent } from './legal/imprint/imprint.component';
import { DataProtectionComponent } from './legal/data-protection/data-protection.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'impressum', component: ImprintComponent},
  { path: 'datenschutzerklaerung', component: DataProtectionComponent},
  { path: 'single-user', component: SingleUserComponent },
];
