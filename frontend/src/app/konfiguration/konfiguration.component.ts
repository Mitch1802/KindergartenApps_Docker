import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalDataService } from 'src/app/_service/global-data.service';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatList, MatListItem } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { environment } from "src/environments/environment";
import { Router } from '@angular/router';
import { HeaderComponent } from '../_template/header/header.component';
import { MatChipsModule } from '@angular/material/chips';

@Component({
    selector: 'app-konfiguration',
    templateUrl: './konfiguration.component.html',
    styleUrls: ['./konfiguration.component.sass'],
    imports: [HeaderComponent, MatCardModule, FormsModule, ReactiveFormsModule, MatButton, MatFormField, MatLabel, MatInput, MatList, MatListItem, MatIconModule, MatChipsModule]
})
export class KonfigurationComponent implements OnInit {
  globalDataService = inject(GlobalDataService);
  router = inject(Router);
  breadcrumb: any = [];

  title = "Aktive Rollen";
  title2 = "Backup & Wiederherstellen";
  modul = "users/rolle";
  modul2 = "konfiguration";

  @Output() breadcrumbout = new EventEmitter<any[]>();

  rollen: any = []

  file: HTMLInputElement = document.getElementById("backupUpload") as HTMLInputElement;
  backups: any = [];
  backup_msg = "";

  formRolle = new FormGroup({
    rolle: new FormControl('')
  });

  ngOnInit(): void {
    sessionStorage.setItem("PageNumber", "2");
    sessionStorage.setItem("Page2", "LTP");
    this.breadcrumb = this.globalDataService.ladeBreadcrumb();
    this.formRolle.disable();

    this.globalDataService.get(this.modul2).subscribe({
      next: (erg: any) => {
        try {
          this.formRolle.enable();
          this.rollen = erg.rollen;
          this.backups = this.convertBackups(erg.backups);
        } catch (e: any) {
          this.globalDataService.erstelleMessage("error", e);
        }
      },
      error: (error: any) => {
        this.globalDataService.errorAnzeigen(error);
      }
    });
  }

  rolleSpeichern(): void {
    const object = this.formRolle.value;
    const rolle_neu = object.rolle;

    const post = {
      "key": rolle_neu,
      "verbose_name": rolle_neu
    }


    this.globalDataService.post(this.modul, post, false).subscribe({
      next: (erg: any) => {
        try {
          this.formRolle.reset();
          if (!this.rollen.find((r: any) => r.key === erg.key)) {
            this.rollen.push(erg);
          }
          this.globalDataService.erstelleMessage("success","Rolle erfolgreich gespeichert!");
        } catch (e: any) {
          this.globalDataService.erstelleMessage("error", e);
        }
      },
      error: (error: any) => {
        this.globalDataService.errorAnzeigen(error);
      }
    });
  }

  rolleLoeschen(rolle: any): void {
    const id = rolle.id;
    this.globalDataService.delete(this.modul, id).subscribe({
      next: (erg: any) => {
        try {
          this.rollen = this.rollen.filter((r: any) => r.id !== id);
          this.globalDataService.erstelleMessage("success", "Rolle erfolgreich gelöscht!");
        } catch (e: any) {
          this.globalDataService.erstelleMessage("error", e);
        }
      },
      error: (error: any) => {
        this.globalDataService.errorAnzeigen(error);
      }
    });
  }

  backupImport(backup_name: any): void {
    const object = {
      "backup": backup_name.name
    }

    this.globalDataService.post("backup/restore", object, false).subscribe({
      next: (erg: any) => {
        try {
          this.backup_msg = erg.msg;
          this.globalDataService.erstelleMessage("success",this.backup_msg);
          sessionStorage.clear();
          document.cookie.split('; ').forEach(cookie => {
            const [name] = cookie.split('=');
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          });
          this.router.navigate(['/login']);
        } catch (e: any) {
          this.globalDataService.erstelleMessage("error", e);
        }
      },
      error: (error: any) => {
        this.globalDataService.errorAnzeigen(error);
      }
    });
  }

  backupErstellen(): void {
    this.globalDataService.post("backup", {}, false).subscribe({
      next: (erg: any) => {
        try {
          this.backup_msg = erg.msg;
          this.backups = this.convertBackups(erg.backups);
          this.globalDataService.erstelleMessage("success",this.backup_msg);
        } catch (e: any) {
          this.globalDataService.erstelleMessage("error", e);
        }
      },
      error: (error: any) => {
        this.globalDataService.errorAnzeigen(error);
      }
    });
  }

  backupDownload(backup_name: any): void {
    const object = {
      "backup": backup_name.name
    }

    this.globalDataService.postBlob("backup/file", object).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = backup_name.name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      },
      error: (error: any) => {
        this.globalDataService.errorAnzeigen(error);
      }
    });
  }

  backupLoeschen(backup_name: any): void {
    const object = {
      "backup": backup_name.name
    }

    this.globalDataService.post("backup/delete", object, false).subscribe({
      next: (erg: any) => {
        try {
          this.backup_msg = erg.msg;
          this.backups = this.convertBackups(erg.backups);
          this.globalDataService.erstelleMessage("success",this.backup_msg);
        } catch (e: any) {
          this.globalDataService.erstelleMessage("error", e);
        }
      },
      error: (error: any) => {
        this.globalDataService.errorAnzeigen(error);
      }
    });
  }


  convertBackups(backup_array:any ): any {
    const version = environment.version;
    let data = [];
    for (let i = 0; i < backup_array.length; i++) {
      const file = backup_array[i];
      let backup_version = file.split('_');
      backup_version = backup_version[1];

      if (backup_version == version) {
        const dict = {
          "name": file,
        }
        data.push(dict);
      }
    }
    data = this.globalDataService.arraySortByKeyDesc(data, "name");
    return data;
  }
}
