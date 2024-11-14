import { Component, OnInit } from '@angular/core';
import { RegisterService } from '../../services/register.service';
import { usuario } from '../interfaces/usuario';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Platform } from '@ionic/angular';

import { Filesystem as FileSystem } from '@capacitor/filesystem';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private register: RegisterService,
    private platform: Platform,
  ) {}
  lista_register: usuario[] = [];
  async ngOnInit() {
    await this.update_data();
    // valida si la app tiene permisos para el Filesystem
    if (this.platform.is('capacitor')) {
      FileSystem.checkPermissions().then();
      FileSystem.removeAllListeners();
    }
  }
  async update_data() {
    this.lista_register = await this.register.loadGrid();
  }

  // Function for export to xlsx
  async exportToXlsx() {
    const data = await this.register.loadGrid();
    const ws = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = { Sheets: { data: ws }, SheetNames: ['data'] };
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const fileName = 'data' + fileExtension;

    const blob = new Blob(
      [XLSX.write(wb, { bookType: 'xlsx', type: 'array' })],
      {
        type: fileType,
      },
    );

    //saveAs(blob, fileName);
    if (this.platform.is('capacitor')) {
      this.blobFileWrite(fileName, blob);
    } else {
      saveAs(blob, fileName);
    }
  }

  blobFileWrite(filename: string, blobfile: Blob) {
    const reader = new FileReader();

    // This fires after the blob has been read/loaded.
    reader.addEventListener('loadend', (e: any) => {
      const text = e.srcElement.result;
      this.fileWrite(filename, text);
    });

    // Start reading the blob as text.
    reader.readAsText(blobfile);
  }
  fileWrite(filename: string, filedata: string) {
    try {
      FileSystem.writeFile({
        path: filename,
        data: filedata,
        // ,
        // directory: FilesystemDirectory.Documents,
        // encoding: FilesystemEncoding.UTF8
      });
    } catch (e) {
      console.error('Unable to write file', e);
    }
  }
}
