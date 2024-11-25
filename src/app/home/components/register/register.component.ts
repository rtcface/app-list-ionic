import { Component, OnInit } from '@angular/core';
import { RegisterService } from '../../services/register.service';
import { usuario } from '../interfaces/usuario';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Platform } from '@ionic/angular';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
//
// import {
//   Filesystem as FileSystem,
//   Directory,
//   Encoding,
// } from '@capacitor/filesystem';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private register: RegisterService,
    private platform: Platform,
    private file: File,
    private androidPermissions: AndroidPermissions,
  ) {
    this.platform.ready().then(() => {
      console.log('Plataforma lista');
    });
  }
  lista_register: usuario[] = [];
  async ngOnInit() {
    await this.update_data();
    // valida si la app tiene permisos para el Filesystem
    if (this.platform.is('capacitor')) {
      console.log('---------platform is capacitor-------');
      const permission = await this.androidPermissions.checkPermission(
        this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
      );
      if (!permission.hasPermission) {
        console.log('no tiene permisos');
        await this.androidPermissions.requestPermission(
          this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
        );
      }
      console.log('permisos ok');
    }
  }
  async update_data() {
    console.log('update_data');
    //
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
      console.log('---------platform is capacitor-------');
      this.blobFileWrite('data_file/' + fileName, blob);
    } else {
      console.log('---------platform is not capacitor-------');
      saveAs(blob, fileName);
    }
  }

  blobFileWrite(filename: string, blobfile: Blob) {
    const reader = new FileReader();

    // This fires after the blob has been read/loaded.
    // reader.addEventListener('loadend', (e: any) => {
    //   const text = e.srcElement.result;
    // });

    this.fileWrite(filename, blobfile);

    // Start reading the blob as text.
    reader.readAsText(blobfile);
  }
  async fileWrite(fileName: string, blob: Blob) {
    try {
      const path = this.platform.is('capacitor')
        ? this.file.externalDataDirectory
        : this.file.documentsDirectory;

      const fullPath = `${path}${fileName}.xlsx`;

      // Escribir archivo
      await this.file.writeFile(path, `${fileName}.xlsx`, blob, {
        replace: true,
      });
      console.log('Archivo guardado en:', fullPath);
      alert(`Archivo guardado en: ${fullPath}`);
    } catch (e) {
      console.error('Error al exportar:', e);
      alert('Hubo un error al exportar el archivo.');
    }
  }
}
