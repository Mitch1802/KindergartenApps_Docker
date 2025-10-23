import { Component, OnInit, inject } from '@angular/core';
import { GlobalDataService } from 'src/app/_service/global-data.service';
import { HeaderComponent } from '../_template/header/header.component';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import * as pdfMake from "pdfmake/build/pdfmake";

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
  json_data: any = [];
  final_data: any = [];
  config_auswahl: any = [];

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

  preparePdfDaten(): any {
    let auswahl = [];
    for (let i = 0; i < this.config_auswahl.length; i++) {
        if (this.config_auswahl[i]['checked'] == true) {
            auswahl.push(this.config_auswahl[i]);
        }
    }

    let config_table: any = {}

    for (let b = 1; b <= 8; b++) {
        let count = 0;
        if (auswahl.length == 0) {
            let bz_1: any = document.getElementById("bz_1").innerHTML;
            let bz_2: any = document.getElementById("bz_2").innerHTML;
            let bz_3: any = document.getElementById("bz_3").innerHTML;
            let bz_4: any = document.getElementById("bz_4").innerHTML;
            let bz_5: any = document.getElementById("bz_5").innerHTML;
            let bz_6: any = document.getElementById("bz_6").innerHTML;
            let bz_7: any = document.getElementById("bz_7").innerHTML;
            let bz_8: any = document.getElementById("bz_8").innerHTML;

            bz_1 = bz_1.split('<');
            bz_2 = bz_2.split('<');
            bz_3 = bz_3.split('<');
            bz_4 = bz_4.split('<');
            bz_5 = bz_5.split('<');
            bz_6 = bz_6.split('<');
            bz_7 = bz_7.split('<');
            bz_8 = bz_8.split('<');

            config_table['Cell_1_0'] = bz_1[0];
            config_table['Cell_2_0'] = bz_2[0];
            config_table['Cell_3_0'] = bz_3[0];
            config_table['Cell_4_0'] = bz_4[0];
            config_table['Cell_5_0'] = bz_5[0];
            config_table['Cell_6_0'] = bz_6[0];
            config_table['Cell_7_0'] = bz_7[0];
            config_table['Cell_8_0'] = bz_8[0];
        }

        for (let i = 0; i < auswahl.length; i++) {
            let id = auswahl[i]['id'];
            id = id.split('_');
            let id_bz = id[1];

            if (b == id_bz) {
                let cell_bz = "Cell_" + b + "_0";
                let bb = auswahl[i]['Bildungsbereich'];
                config_table[cell_bz] = bb;
                count += 1;
                let cell = "Cell_" + b + "_" + count;
                config_table[cell] = auswahl[i]['Lernziel'] + " - " + auswahl[i]['Stufe'];
            }
        }
        let rest = 8 - count;

        if (rest > 0) {
            for (let r = 0; r < rest; r++) {
                let nr = 8 - r;
                let cell = "Cell_" + b + "_" + nr;
                config_table[cell] = "";
            }
        }
    }

    let config = {
        // 'thema': inp_Thema.value,
        // 'monat': inp_Monat.value,
        // 'erstellt': inp_Erstellt.value,
        'table': config_table
    }

    return config
  }

  prepareAusdruck(paperSize: string, tableConfig: any): any {
    let table = [];
    let tableHeight = 40;
    let tableFontSize = 5;
    let pdfPaperSize = '';

    var cell = function (cell: any) {
        let nr = cell.split('_');
        nr = nr[2];
        if (nr == '0') {
            return { text: tableConfig['table'][cell], style: 'tableHeader' };
        } else if (nr == '*') {
            return { text: tableConfig['thema'], style: 'tableTitle' };
        } else {
            return { text: tableConfig['table'][cell], style: 'tableCell' };
        }
    }

    if (paperSize == 'A3' || paperSize == 'A4') {
        pdfPaperSize = paperSize;
    }

    if (paperSize == 'A3') {
        tableHeight = 60;
        tableFontSize = 9;
    }



    table = [
        [cell('Cell_1_1'), cell('Cell_1_2'), cell('Cell_1_3'), cell('Cell_2_1'), cell('Cell_2_2'), cell('Cell_2_3'), cell('Cell_3_1'), cell('Cell_3_2'), cell('Cell_3_3')],
        [cell('Cell_1_4'), cell('Cell_1_0'), cell('Cell_1_5'), cell('Cell_2_4'), cell('Cell_2_0'), cell('Cell_2_5'), cell('Cell_3_4'), cell('Cell_3_0'), cell('Cell_3_5')],
        [cell('Cell_1_6'), cell('Cell_1_7'), cell('Cell_1_8'), cell('Cell_2_6'), cell('Cell_2_7'), cell('Cell_2_8'), cell('Cell_3_6'), cell('Cell_3_7'), cell('Cell_3_8')],
        [cell('Cell_4_1'), cell('Cell_4_2'), cell('Cell_4_3'), cell('Cell_1_0'), cell('Cell_2_0'), cell('Cell_3_0'), cell('Cell_5_1'), cell('Cell_5_2'), cell('Cell_5_3')],
        [cell('Cell_4_4'), cell('Cell_4_0'), cell('Cell_4_5'), cell('Cell_4_0'), cell('Cell_0_*'), cell('Cell_5_0'), cell('Cell_5_4'), cell('Cell_5_0'), cell('Cell_5_5')],
        [cell('Cell_4_6'), cell('Cell_4_7'), cell('Cell_4_8'), cell('Cell_6_0'), cell('Cell_7_0'), cell('Cell_8_0'), cell('Cell_5_6'), cell('Cell_5_7'), cell('Cell_5_8')],
        [cell('Cell_6_1'), cell('Cell_6_2'), cell('Cell_6_3'), cell('Cell_7_1'), cell('Cell_7_2'), cell('Cell_7_3'), cell('Cell_8_1'), cell('Cell_8_2'), cell('Cell_8_3')],
        [cell('Cell_6_4'), cell('Cell_6_0'), cell('Cell_6_5'), cell('Cell_7_4'), cell('Cell_7_0'), cell('Cell_7_5'), cell('Cell_8_4'), cell('Cell_8_0'), cell('Cell_8_5')],
        [cell('Cell_6_6'), cell('Cell_6_7'), cell('Cell_6_8'), cell('Cell_7_6'), cell('Cell_7_7'), cell('Cell_7_8'), cell('Cell_8_6'), cell('Cell_8_7'), cell('Cell_8_8')],
    ]

    var docDefinition = {
        content: [
            {
                alignment: 'justify',
                columns: [
                    { text: 'Lotusplan', style: 'header' },
                    { text: tableConfig['monat'], style: 'datum' },
                ]
            },
            {
                style: 'tableExample',
                table: {
                    widths: ['*', '*', '*', '*', '*', '*', '*', '*', '*'],
                    heights: tableHeight,
                    body: table
                },
                layout: {
                    hLineWidth: function (i: any, node: any) {
                        return (i === 3 || i === 6) ? 2 : 1;
                    },
                    vLineWidth: function (i: any, node: any) {
                        return (i === 3 || i === 6) ? 2 : 1;
                    },
                },
            },
        ],
        styles: {
            header: {
                fontSize: tableHeight,
                bold: true,
                margin: [0, 0, 0, 10]
            },
            datum: {
                fontSize: tableHeight / 2,
                italics: true,
                alignment: 'right',
                margin: [0, tableHeight / 2, 0, 0]
            },
            tableExample: {
                margin: [0, 50, 0, 15]
            },
            tableHeader: {
                bold: true,
                fontSize: tableFontSize + 3,
                alignment: 'center',
                fillColor: '#dbf0a8'
            },
            tableTitle: {
                bold: true,
                fontSize: tableFontSize + 3,
                alignment: 'center',
                fillColor: '#f7ebc8'
            },
            tableCell: {
                fontSize: tableFontSize,
                alignment: 'center',
                padding: 'auto'
            }
        },
        pageSize: pdfPaperSize,
        pageOrientation: 'landscape',
    }

    return docDefinition;
}

  ausdruckMappeErstellen(download: boolean): void  {
    let config = this.preparePdfDaten();
    let docDefinition = this.prepareAusdruck('A4', config);
    let date = config["erstellt"];
    date = date.replaceAll("-", "");
    let dateiname = "Lotusplan_A4_" + date + ".pdf";
    if (download == true) {
        pdfMake.createPdf(docDefinition).download(defaultFileName=dateiname);
    }else {
        pdfMake.createPdf(docDefinition).open();
    }
  }

  ausdruckAushangErstellen(download: boolean): void  {
    let config = this.preparePdfDaten();
    let docDefinition = this.prepareAusdruck('A3', config);
    let date = config["erstellt"];
    date = date.replaceAll("-", "");
    let dateiname = "Lotusplan_A3_" + date + ".pdf";
    if (download == true) {
        pdfMake.createPdf(docDefinition).download(defaultFileName=dateiname);
    }else {
        pdfMake.createPdf(docDefinition).open();
    }
  }
}
