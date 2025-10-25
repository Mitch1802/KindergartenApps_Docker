import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { HeaderComponent } from '../_template/header/header.component';
import { GlobalDataService } from '../_service/global-data.service';

@Component({
  selector: 'app-entwicklungsgespraech',
  imports: [HeaderComponent, MatCardModule],
  templateUrl: './entwicklungsgespraech.component.html',
  styleUrl: './entwicklungsgespraech.component.sass'
})
export class EntwicklungsgespraechComponent implements OnInit {
    globalDataService = inject(GlobalDataService);

    title = "Entwicklungsgespräch";
    modul = "entwicklungsgespraech";

    breadcrumb: any = [];

    ngOnInit(): void {
      sessionStorage.setItem("PageNumber", "2");
      sessionStorage.setItem("Page2", "ENG");
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
