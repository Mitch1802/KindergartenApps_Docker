import { Component, OnInit, inject } from '@angular/core';
import { GlobalDataService } from 'src/app/_service/global-data.service';
import { HeaderComponent } from '../_template/header/header.component';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-lotusplan',
  imports: [ HeaderComponent, MatCardModule, MatInputModule, MatSelectModule, MatButtonModule ],
  templateUrl: './lotusplan.component.html',
  styleUrl: './lotusplan.component.sass'
})
export class LotusplanComponent implements OnInit {
  globalDataService = inject(GlobalDataService);
  router = inject(Router);

  title = "Lotusplan";
  modul = "lotusplan";

  breadcrumb: any = [];

  formModul = new FormGroup({
    thema: new FormControl(''),
    monat: new FormControl(''),
    erstellt: new FormControl(''),
    max: new FormControl('')
  });

  ngOnInit(): void {
    sessionStorage.setItem("PageNumber", "2");
    sessionStorage.setItem("Page2", "LTP");
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

  convertDataForAccordion(loaded: boolean): void {}

  zeichneAccordionItems(data: any, bildungsbereich: any, x: any, loaded: boolean): void {}

  zeichneAuswahl(data: any, x: any, loaded: boolean): void {}

  maxAendern(): void  {
    this.convertDataForAccordion(false);
  }

  changeAuswahlCount(cbId: any): void {}

  saveKonfig(): void  {
    // TODO JSON Daten speichern in DB
  }

  loadKonfig(): void  {
    // TODO JSON Daten laden aus DB
  }

  preparePdfDaten(): void {}

  prepareAusdruck(paperSize: string, tableConfig: any): void {}

  ausdruckMappeErstellen(download: boolean): void  {}

  ausdruckAushangErstellen(download: boolean): void  {}
}
