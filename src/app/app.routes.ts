import { Routes } from '@angular/router';
import { SingleUserComponent } from './main-page/single-user/single-user.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
    { path: '', component: AppComponent },
    { path: 'single-user', component: SingleUserComponent },
];
