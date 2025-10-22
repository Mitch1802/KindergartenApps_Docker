import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouteReuseStrategy, DetachedRouteHandle, ActivatedRouteSnapshot, withRouterConfig } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

class NoReuseStrategy implements RouteReuseStrategy {
  shouldDetach(route: ActivatedRouteSnapshot): boolean { return false; }
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {}
  shouldAttach(route: ActivatedRouteSnapshot): boolean { return false; }
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null { return null; }
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean { return false; }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' })),
    provideHttpClient(),
    provideAnimations(),
    provideCharts(withDefaultRegisterables()),
    { provide: RouteReuseStrategy, useClass: NoReuseStrategy },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { subscriptSizing: 'dynamic' } }
  ]
}).catch(err => console.error(err));
