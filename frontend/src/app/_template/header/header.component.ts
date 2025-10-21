import { Component, OnInit, Input, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { GlobalDataService } from 'src/app/_service/global-data.service';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.sass'],
    imports: [
        MatToolbar,
        RouterLink,
        MatIconButton,
        MatIconModule,
        MatButton
    ]
})
export class HeaderComponent implements OnInit {
  globalDataService = inject(GlobalDataService);
  private router = inject(Router);

  title = '';

  @Input() breadcrumb!: any;

  ngOnInit(): void {
    this.title = this.globalDataService.Titel;
  }

  onClick(link: string): void {
    this.globalDataService.ladeBreadcrumb();
    this.router.navigate([link]);
  }
}
