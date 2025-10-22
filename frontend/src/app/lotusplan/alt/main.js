json_data = []
final_data = []
config_auswahl = []

inp_Thema = document.getElementById("inpThema");
inp_Monat = document.getElementById("inpMonat");
inp_Erstellt = document.getElementById("inpErstellt");
inp_Max = document.getElementById("inpMax");
accordion = document.getElementById("accordionBildungsbereich");

function ladeDaten() {
    inp_Erstellt.valueAsDate = new Date();

    $.getJSON("Lotusplan.json", function (data) {
        json_data = data;
    }).done(function () {
        convertDataForAccordion(false);
    })
}

function convertDataForAccordion(loaded) {
    accordion.innerHTML = "";
    bildungsbereiche = [];
    config_auswahl = []

    for (let i = 0; i < json_data.length; i++) {
        bildungsbereich = json_data[i]["Bildungsbereich"];
        if (bildungsbereiche.includes(bildungsbereich) == false) {
            bildungsbereiche.push(bildungsbereich);
        }
    }

    for (let x = 0; x < bildungsbereiche.length; x++) {
        data = [];
        for (let i = 0; i < json_data.length; i++) {
            if (bildungsbereiche[x] == json_data[i]["Bildungsbereich"]) {
                data.push(json_data[i]);
            }
        }
        zeichneAccordionItems(data, data[0]["Bildungsbereich"], x + 1, loaded);
    }
}

function zeichneAccordionItems(data, bildungsbereich, x, loaded) {
    let accItem = document.createElement("div");
    accItem.className = "accordion-item";

    let title = document.createElement("h2");
    title.className = "accordion-header";
    let btn = document.createElement("button");
    btn.className = "accordion-button collapsed";
    btn.type = "button";
    btn.setAttribute("data-bs-toggle", "collapse");
    btn.setAttribute("data-bs-target", "#flush-collapse" + x);
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", "flush-collapse" + x);
    btn.innerHTML = bildungsbereich;
    btn.id = "bz_" + x;
    let span = document.createElement("span");
    span.className = "badge rounded-pill text-bg-success ms-3";
    span.id = "count_" + x;
    if (loaded == true) {
        count = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i]['checked'] == true) {
                count += 1;
            }
        }
        span.innerHTML = count + " / " + inp_Max.value;
    } else {
        span.innerHTML = "0 / " + inp_Max.value;
    }
    btn.appendChild(span);
    title.appendChild(btn);
    accItem.appendChild(title);

    accItem.appendChild(zeichneAuswahl(data, x, loaded));

    accordion.appendChild(accItem);
}

function zeichneAuswahl(data, x, loaded) {
    stufen = [];

    for (let i = 0; i < data.length; i++) {
        stufe = data[i]["Stufe"];
        if (stufen.includes(stufe) == false) {
            stufen.push(stufe);
        }
    }

    let div = document.createElement("div");
    div.id = "flush-collapse" + x;
    div.className = "accordion-collapse collapse";
    div.setAttribute("data-bs-parent", "#accordionBildungsziele");

    let body = document.createElement("div");
    body.className = "accordion-body";

    for (let s = 0; s < stufen.length; s++) {
        let stufe = stufen[s];

        let h4 = document.createElement("h4");
        h4.className = "m-2";
        h4.innerHTML = stufe;
        body.appendChild(h4);

        let ul = document.createElement("ul");
        ul.className = "list-group list-group-flush mt-1";

        for (let i = 0; i < data.length; i++) {
            if (stufe == data[i]["Stufe"]) {
                let nr = i + 1;
                let id = "lz_" + x + "_" + nr;

                let li = document.createElement("li");
                li.className = "list-group-item";

                let cb = document.createElement("input");
                cb.className = "form-check-input me-1";
                cb.type = "checkbox";
                if (loaded == true) {
                    cb.checked = data[i]['checked'];
                } else {
                    cb.checked = false;
                }
                cb.addEventListener("change", function () {
                    changeAuswahlCount(id);
                });
                cb.id = id;
                li.appendChild(cb);

                let lbl = document.createElement("label");
                lbl.className = "form-check-label stretched-link";
                lbl.setAttribute("for", id);
                lbl.innerHTML = data[i]["Lernziel"];
                li.appendChild(lbl);

                ul.appendChild(li);

                dict_config = {
                    'id': id,
                    'checked': cb.checked,
                    'Bildungsbereich': data[0]['Bildungsbereich'],
                    'Stufe': stufe,
                    'Lernziel': data[i]["Lernziel"]
                }

                config_auswahl.push(dict_config)
            }
        }

        body.appendChild(ul);
    }

    div.appendChild(body);

    return div
}

function maxAendern() {
    convertDataForAccordion(false);
}

function changeAuswahlCount(cbId) {
    id = cbId.split("_");
    id = id[1];
    let cb = document.getElementById(cbId);
    let count = document.getElementById("count_" + id);

    if (cb.checked) {
        let value = count.innerHTML;
        wert = value.split(" ");
        wert = parseInt(wert[0]) + 1;

        if (wert > parseInt(inp_Max.value)) {
            wert = wert - 1;
            cb.checked = false;
            alert("Maximale Anzahl von " + inp_Max.value + " Lernzielen erreicht!");
        }

        count.innerHTML = wert + " / " + inp_Max.value;
    } else {
        let value = count.innerHTML;
        wert = value.split(" ");
        wert = parseInt(wert[0]) - 1;
        count.innerHTML = wert + " / " + inp_Max.value;
    }

    for (let i = 0; i < config_auswahl.length; i++) {
        conf_id = config_auswahl[i]['id'];

        if (cbId == conf_id) {
            config_auswahl[i]['checked'] = cb.checked;
        }
    }
    console.log("Test");
}

function saveKonfig() {
    dateiname = "config.json";

    config = {
        'thema': inp_Thema.value,
        'monat': inp_Monat.value,
        'erstellt': inp_Erstellt.value,
        'max': inp_Max.value,
        'lernziele': config_auswahl
    }

    var json = JSON.stringify(config);
    json = [json];
    var blob1 = new Blob(json, { type: "text/javascript;charset=utf-8" });
    var isIE = false || !!document.documentMode;
    if (isIE) {
        window.navigator.msSaveBlob(blob1, dateiname);
    } else {
        var url = window.URL || window.webkitURL;
        link = url.createObjectURL(blob1);
        var a = $("<a />");
        a.attr("download", dateiname);
        a.attr("href", link);
        $("body").append(a);
        a[0].click();
        $("body").remove(a);
    }
}

function loadKonfig() {
    var uploadKonfig = document.getElementById('inpFileKonfig').files[0];
    var reader = new FileReader();
    reader.onload = convertUploadKonfig;
    reader.readAsText(uploadKonfig);
}

function convertUploadKonfig(event) {
    var obj = JSON.parse(event.target.result);
    inp_Thema.value = obj['thema'];
    inp_Monat.value = obj['monat'];
    inp_Erstellt.value = obj['erstellt'];
    inp_Max.value = obj['max'];
    json_data = obj['lernziele'];
    convertDataForAccordion(true);
}

function preparePdfDaten() {
    auswahl = [];
    for (let i = 0; i < config_auswahl.length; i++) {
        if (config_auswahl[i]['checked'] == true) {
            auswahl.push(config_auswahl[i]);
        }
    }

    config_table = {}

    for (let b = 1; b <= 8; b++) {
        count = 0;
        if (auswahl.length == 0) {
            bz_1 = document.getElementById("bz_1").innerHTML;
            bz_2 = document.getElementById("bz_2").innerHTML;
            bz_3 = document.getElementById("bz_3").innerHTML;
            bz_4 = document.getElementById("bz_4").innerHTML;
            bz_5 = document.getElementById("bz_5").innerHTML;
            bz_6 = document.getElementById("bz_6").innerHTML;
            bz_7 = document.getElementById("bz_7").innerHTML;
            bz_8 = document.getElementById("bz_8").innerHTML;

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
            id = auswahl[i]['id'];
            id = id.split('_');
            id_bz = id[1];

            if (b == id_bz) {
                cell_bz = "Cell_" + b + "_0";
                bb = auswahl[i]['Bildungsbereich'];
                config_table[cell_bz] = bb;
                count += 1;
                cell = "Cell_" + b + "_" + count;
                config_table[cell] = auswahl[i]['Lernziel'] + " - " + auswahl[i]['Stufe'];
            }
        }
        rest = 8 - count;

        if (rest > 0) {
            for (let r = 0; r < rest; r++) {
                nr = 8 - r;
                cell = "Cell_" + b + "_" + nr;
                config_table[cell] = "";
            }
        }
    }

    config = {
        'thema': inp_Thema.value,
        'monat': inp_Monat.value,
        'erstellt': inp_Erstellt.value,
        'table': config_table
    }

    return config
}

function prepareAusdruck(paperSize, tableConfig) {
    let table = [];
    let tableHeight = 40;
    let tableFontSize = 5;
    let pdfPaperSize = '';

    var cell = function (cell) {
        nr = cell.split('_');
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
                    hLineWidth: function (i, node) {
                        return (i === 3 || i === 6) ? 2 : 1;
                    },
                    vLineWidth: function (i, node) {
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

function ausdruckMappeErstellen(download) {
    let config = preparePdfDaten();
    let docDefinition = prepareAusdruck('A4', config);
    let date = config["erstellt"];
    date = date.replaceAll("-", "");
    let dateiname = "Lotusplan_A4_" + date + ".pdf";
    if (download == 1) {
        pdfMake.createPdf(docDefinition).download(defaultFileName=dateiname);
    }else {
        pdfMake.createPdf(docDefinition).open();
    }
}

function ausdruckAushangErstellen(download) {
    let config = preparePdfDaten();
    let docDefinition = prepareAusdruck('A3', config);
    let date = config["erstellt"];
    date = date.replaceAll("-", "");
    let dateiname = "Lotusplan_A3_" + date + ".pdf";
    if (download == 1) {
        pdfMake.createPdf(docDefinition).download(defaultFileName=dateiname);
    }else {
        pdfMake.createPdf(docDefinition).open();
    }
}