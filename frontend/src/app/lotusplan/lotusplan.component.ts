import { Component, Signal, OnInit, inject, computed } from '@angular/core';
import { GlobalDataService } from 'src/app/_service/global-data.service';
import { HeaderComponent } from '../_template/header/header.component';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';

import { LOTUSPLAN_MOCK } from './lotusplan_json';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';

import type { TDocumentDefinitions, Alignment, PageSize } from 'pdfmake/interfaces';
import * as pdfMake from 'pdfmake/build/pdfmake';
import 'pdfmake/build/vfs_fonts';

export interface LernzielItem {
    Bildungsbereich: string;
    Stufe: string;
    Lernziel: string;
}

type Grouped = Record<string, Record<string, LernzielItem[]>>;

@Component({
    selector: 'app-lotusplan',
    imports: [HeaderComponent, MatCardModule, MatCheckboxModule, MatInputModule, MatSelectModule, MatButtonModule, MatExpansionModule, ReactiveFormsModule],
    templateUrl: './lotusplan.component.html',
    styleUrl: './lotusplan.component.sass',
})
export class LotusplanComponent implements OnInit {
    globalDataService = inject(GlobalDataService);

    title = "Lotusplan";
    modul = "lotusplan";

    breadcrumb: any = [];
    config_auswahl: LernzielItem[] = []

    form = new FormGroup({
        thema: new FormControl(''),
        monat: new FormControl(''),
        erstellt: new FormControl(''),
        max: new FormControl(8, { validators: [Validators.required, Validators.max(8)] }),
    });

    selected = new Set<string>();
    bereichKeys = computed(() => Object.keys(this.grouped()));
    stufeKeys(bereich: string) { return Object.keys(this.grouped()[bereich]); }

    ngOnInit(): void {
        sessionStorage.setItem("PageNumber", "2");
        sessionStorage.setItem("Page2", "LTP");
        this.breadcrumb = this.globalDataService.ladeBreadcrumb();
        this.config_auswahl = []
        const today = new Date();
        const pad = (n: number) => String(n).padStart(2, '0');
        const ymd = `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`;
        this.form.patchValue({ erstellt: ymd });

        

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

    // Gruppierung wie vorher (siehe deine Version)
    grouped: Signal<Record<string, Record<string, any[]>>> = computed(() => {
        const g: Record<string, Record<string, any[]>> = {};
        for (const d of LOTUSPLAN_MOCK) {
            const b = d.Bildungsbereich;
            const s = d.Stufe;
            (g[b] ??= {}); (g[b][s] ??= []);
            g[b][s].push(d);
        }
        return g;
    });

    private key(it: any) {
        return `${it.Bildungsbereich}||${it.Stufe}||${it.Lernziel}`;
    }

    isSelected(it: any) { return this.selected.has(this.key(it)); }

    toggle(it: any, ev: MatCheckboxChange) {
        const k = this.key(it);
        const max = Number(this.form.get('max')?.value ?? 8); // ⬅️ sicher als Zahl

        const bereich = it.Bildungsbereich;
        const count = this.countInBereich(bereich);

        if (ev.checked) {
            if (count >= max) {
                ev.source.checked = false;
                return;
            }
            this.selected.add(k);
        } else {
            this.selected.delete(k);
        }
    }

    countInBereich(bereich: string) {
        return [...this.selected].filter(k => k.startsWith(bereich + '||')).length;
    }

    getSelectedItems(): LernzielItem[] {
        return LOTUSPLAN_MOCK.filter(it => this.selected.has(this.key(it)));
    }

    private getBereichIndex(bereich: string): number {
        const keys = this.bereichKeys();           // Signal -> Aufruf liefert string[]
        const idx = keys.indexOf(bereich);
        return idx >= 0 ? idx + 1 : 1;             // falls unbekannt, auf 1 fallback
    }

    preparePdfDaten() {
        const auswahl = this.getSelectedItems();
        const config_table: Record<string, string> = {};
        const bereiche = this.bereichKeys(); // max 8 werden berücksichtigt

        for (let i = 0; i < 8; i++) {
            const bereichName = bereiche[i] ?? '';
            const bIndex = i + 1; // 1..8
            config_table[`Cell_${bIndex}_0`] = bereichName; // Header-Zelle (Bereich)
            for (let n = 1; n <= 8; n++) {
                config_table[`Cell_${bIndex}_${n}`] = '';     // Inhalte vorbefüllen
            }
        }

        const bucketMap = new Map<number, { header: string; items: string[] }>();
        for (const it of auswahl) {
            const idx = this.getBereichIndex(it.Bildungsbereich); // 1..8
            const bucket = bucketMap.get(idx) ?? { header: it.Bildungsbereich, items: [] };
            bucket.header = it.Bildungsbereich; // sicherstellen
            bucket.items.push(`${it.Lernziel} - ${it.Stufe}`);
            bucketMap.set(idx, bucket);
        }

        for (const [idx, bucket] of bucketMap) {
            config_table[`Cell_${idx}_0`] = bucket.header;
            bucket.items.slice(0, 8).forEach((txt, i) => {
                config_table[`Cell_${idx}_${i + 1}`] = txt;
            });
        }

        const { thema, monat, erstellt } = this.form.value;

        const config = {
            thema: (thema as string) ?? '',
            monat: (monat as string) ?? '',
            erstellt: (erstellt as string) ?? '',
            table: config_table,
        };

        return config;
    }

    prepareAusdruck(paperSize: 'A3' | 'A4', tableConfig: any): TDocumentDefinitions {
        // Typsichere Literalwerte:
        const alignJustify: Alignment = 'justify';

        // PageSize niemals als leerer String initialisieren
        let pdfPaperSize: PageSize = paperSize; // 'A3' | 'A4'

        let tableHeight = 40;
        let tableFontSize = 5;

        if (paperSize === 'A3') {
            tableHeight = 60;
            tableFontSize = 9;
        }

        const cell = (cellKey: string) => {
            const parts = cellKey.split('_');
            const nr = parts[2];
            if (nr === '0') {
                return { text: tableConfig.table[cellKey] ?? '', style: 'tableHeader' };
            } else if (nr === '*') {
                return { text: tableConfig.thema ?? '', style: 'tableTitle' };
            } else {
                return { text: tableConfig.table[cellKey] ?? '', style: 'tableCell' };
            }
        };

        const table = [
            [cell('Cell_1_1'), cell('Cell_1_2'), cell('Cell_1_3'), cell('Cell_2_1'), cell('Cell_2_2'), cell('Cell_2_3'), cell('Cell_3_1'), cell('Cell_3_2'), cell('Cell_3_3')],
            [cell('Cell_1_4'), cell('Cell_1_0'), cell('Cell_1_5'), cell('Cell_2_4'), cell('Cell_2_0'), cell('Cell_2_5'), cell('Cell_3_4'), cell('Cell_3_0'), cell('Cell_3_5')],
            [cell('Cell_1_6'), cell('Cell_1_7'), cell('Cell_1_8'), cell('Cell_2_6'), cell('Cell_2_7'), cell('Cell_2_8'), cell('Cell_3_6'), cell('Cell_3_7'), cell('Cell_3_8')],
            [cell('Cell_4_1'), cell('Cell_4_2'), cell('Cell_4_3'), cell('Cell_1_0'), cell('Cell_2_0'), cell('Cell_3_0'), cell('Cell_5_1'), cell('Cell_5_2'), cell('Cell_5_3')],
            [cell('Cell_4_4'), cell('Cell_4_0'), cell('Cell_4_5'), cell('Cell_4_0'), cell('Cell_0_*'), cell('Cell_5_0'), cell('Cell_5_4'), cell('Cell_5_0'), cell('Cell_5_5')],
            [cell('Cell_4_6'), cell('Cell_4_7'), cell('Cell_4_8'), cell('Cell_6_0'), cell('Cell_7_0'), cell('Cell_8_0'), cell('Cell_5_6'), cell('Cell_5_7'), cell('Cell_5_8')],
            [cell('Cell_6_1'), cell('Cell_6_2'), cell('Cell_6_3'), cell('Cell_7_1'), cell('Cell_7_2'), cell('Cell_7_3'), cell('Cell_8_1'), cell('Cell_8_2'), cell('Cell_8_3')],
            [cell('Cell_6_4'), cell('Cell_6_0'), cell('Cell_6_5'), cell('Cell_7_4'), cell('Cell_7_0'), cell('Cell_7_5'), cell('Cell_8_4'), cell('Cell_8_0'), cell('Cell_8_5')],
            [cell('Cell_6_6'), cell('Cell_6_7'), cell('Cell_6_8'), cell('Cell_7_6'), cell('Cell_7_7'), cell('Cell_7_8'), cell('Cell_8_6'), cell('Cell_8_7'), cell('Cell_8_8')],
        ];

        const docDefinition: TDocumentDefinitions = {
            content: [
                {
                    alignment: alignJustify, // ⬅️ Alignment statt string
                    columns: [
                        { text: 'Lotusplan', style: 'header' },
                        { text: tableConfig['monat'] ?? '', style: 'datum' },
                    ],
                },
                {
                    style: 'tableExample',
                    table: {
                        widths: ['*', '*', '*', '*', '*', '*', '*', '*', '*'],
                        heights: tableHeight,
                        body: table,
                    },
                    layout: {
                        hLineWidth(i: number, node: any) {
                            return (i === 3 || i === 6) ? 2 : 1;
                        },
                        vLineWidth(i: number, node: any) {
                            return (i === 3 || i === 6) ? 2 : 1;
                        },
                    },
                },
            ],
            styles: {
                header: {
                    fontSize: tableHeight,
                    bold: true,
                    margin: [0, 0, 0, 10],
                },
                datum: {
                    fontSize: tableHeight / 2,
                    italics: true,
                    alignment: 'right',
                    margin: [0, tableHeight / 2, 0, 0],
                },
                tableExample: { margin: [0, 30, 0, 0] },
                tableHeader: {
                    bold: true,
                    fontSize: tableFontSize + 3,
                    alignment: 'center',
                    fillColor: '#dbf0a8',
                },
                tableTitle: {
                    bold: true,
                    fontSize: tableFontSize + 3,
                    alignment: 'center',
                    fillColor: '#f7ebc8',
                },
                tableCell: {
                    fontSize: tableFontSize,
                    alignment: 'center',
                    margin: [2, 2, 2, 2],
                },
            },
            pageSize: pdfPaperSize,
            pageOrientation: 'landscape',
        };

        return docDefinition;
    }

    ausdruckMappeErstellen(download: boolean) {
        let config = this.preparePdfDaten();
        let docDefinition = this.prepareAusdruck('A4', config);
        let date = config["erstellt"];
        date = date.replaceAll("-", "");
        let dateiname = "Lotusplan_A4_" + date + ".pdf";
        if (download == true) {
            pdfMake.createPdf(docDefinition).download(dateiname);
        } else {
            pdfMake.createPdf(docDefinition).open();
        }
    }

    ausdruckAushangErstellen(download: boolean) {
        let config = this.preparePdfDaten();
        let docDefinition = this.prepareAusdruck('A3', config);
        let date = config["erstellt"];
        date = date.replaceAll("-", "");
        let dateiname = "Lotusplan_A3_" + date + ".pdf";
        if (download == true) {
            pdfMake.createPdf(docDefinition).download(dateiname);
        } else {
            pdfMake.createPdf(docDefinition).open();
        }
    }
}
