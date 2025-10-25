import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { StartComponent } from './start/start.component';
import { UserComponent } from './user/user.component';
import { KonfigurationComponent } from './konfiguration/konfiguration.component';
import { LotusplanComponent } from './lotusplan/lotusplan.component';
import { ReflexionComponent } from './reflexion/reflexion.component';
import { WochenplanComponent } from './wochenplan/wochenplan.component';
import { EntwicklungsgespraechComponent } from './entwicklungsgespraech/entwicklungsgespraech.component';
import { LerngeschichteComponent } from './lerngeschichte/lerngeschichte.component';
import { SetupComponent } from './setup/setup.component';

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
    path: 'reflexion', component: ReflexionComponent
  },
  {
    path: 'wochenplan', component: WochenplanComponent
  },
  {
    path: 'entwicklungsgespraech', component: EntwicklungsgespraechComponent
  },
  {
    path: 'lerngeschichte', component: LerngeschichteComponent
  },
  {
    path: 'setup', component: SetupComponent
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
