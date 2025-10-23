import { Component, OnInit, inject } from '@angular/core';

import { GlobalDataService } from '../_service/global-data.service';
import { HeaderComponent } from '../_template/header/header.component';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.sass'],
  imports: [
    HeaderComponent,
    MatCardModule,
    RouterLink,
    MatIconModule
  ]
})
export class StartComponent implements OnInit {
  private globalDataService = inject(GlobalDataService);
  private router = inject(Router);

  username: string = '';
  breadcrumb: any = [];
  rollen: any = [];

  ngOnInit(): void {
    sessionStorage.setItem('PageNumber', '1');
    sessionStorage.setItem('Page1', 'Start');
    sessionStorage.setItem('Page2', '');
    this.username = sessionStorage.getItem('Benutzername') || 'Gast';
    this.breadcrumb = this.globalDataService.ladeBreadcrumb();

    this.rollen = sessionStorage.getItem('Rollen');
    if (this.rollen != null) {
      this.rollen = this.rollen.split(',');
      this.breadcrumb = this.globalDataService.ladeBreadcrumb();
    } else {
      this.router.navigate(['/login']);
    }
  }
}
