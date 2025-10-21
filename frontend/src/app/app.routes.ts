import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { StartComponent } from './start/start.component';
import { UserComponent } from './user/user.component';
import { KonfigurationComponent } from './konfiguration/konfiguration.component';
import { LotusplanComponent } from './lotusplan/lotusplan.component';

export const routes: Routes = [
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'start', component: StartComponent
  },
  {
    path: 'lotusplan', component: LotusplanComponent
  },
  {
    path: 'benutzer', component: UserComponent
  },
  {
    path: 'konfiguration', component: KonfigurationComponent
  },
  {
    path: '*', component: LoginComponent
  }
];
