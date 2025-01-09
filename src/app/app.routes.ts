import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { SingleUserComponent } from './main-page/single-user/single-user.component';
import { ImprintComponent } from './legal/imprint/imprint.component';
import { DataProtectionComponent } from './legal/data-protection/data-protection.component';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';

export const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'impressum', component: ImprintComponent},
  { path: 'datenschutzerklaerung', component: DataProtectionComponent},
  { path: 'single-user', component: SingleUserComponent },
];
