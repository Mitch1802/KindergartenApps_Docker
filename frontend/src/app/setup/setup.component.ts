import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { HeaderComponent } from '../_template/header/header.component';
import { GlobalDataService } from '../_service/global-data.service';

@Component({
  selector: 'app-setup',
  imports: [HeaderComponent, MatCardModule],
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.sass'
})
export class SetupComponent implements OnInit {
    globalDataService = inject(GlobalDataService);

    title = "Einstellungen";
    modul = "setup";

    breadcrumb: any = [];

    ngOnInit(): void {
      sessionStorage.setItem("PageNumber", "2");
      sessionStorage.setItem("Page2", "REF");
      this.breadcrumb = this.globalDataService.ladeBreadcrumb();

      // this.globalDataService.get(this.modul).subscribe({
      //   next: (erg: any) => {
      //     try {
      //       this.convertDataForAccordion(false);
      //     } catch (e: any) {
      //       this.globalDataService.erstelleMessage("error", e);
      //     }
      //   },
      //   error: (error: any) => {
      //     this.globalDataService.errorAnzeigen(error);
      //   }
      // });
    }

}