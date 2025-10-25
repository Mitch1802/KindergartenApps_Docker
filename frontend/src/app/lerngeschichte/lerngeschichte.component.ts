import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { HeaderComponent } from '../_template/header/header.component';
import { GlobalDataService } from '../_service/global-data.service';

@Component({
  selector: 'app-lerngeschichte',
  imports: [HeaderComponent, MatCardModule],
  templateUrl: './lerngeschichte.component.html',
  styleUrl: './lerngeschichte.component.sass'
})
export class LerngeschichteComponent implements OnInit {
    globalDataService = inject(GlobalDataService);

    title = "Lerngeschichte";
    modul = "lerngeschichte";

    breadcrumb: any = [];

    ngOnInit(): void {
      sessionStorage.setItem("PageNumber", "2");
      sessionStorage.setItem("Page2", "LG");
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
