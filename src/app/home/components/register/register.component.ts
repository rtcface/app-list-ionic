import { Component, OnInit } from '@angular/core';
import { RegisterService } from '../../services/register.service';
import { usuario } from '../interfaces/usuario';
//import * as ExcelJS from 'exceljs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor(private register: RegisterService) {}
  lista_register: usuario[] = [];
  async ngOnInit() {
    await this.update_data();
    //await this.register.getAllUsersKeys();
  }
  async update_data() {
    this.lista_register = await this.register.loadGrid();
  }

  // Function for export to xlsx
  async exportToXlsx() {
    const data = await this.register.loadGrid();
    // const workbook = new ExcelJS.Workbook();
    // workbook.creator = 'Ionic App';
    // workbook.lastModifiedBy = 'Ionic App';
    // workbook.created = new Date();
    // workbook.modified = new Date();
    // workbook.lastPrinted = new Date();

    // const worksheet = workbook.addWorksheet('Lista de Usuarios');
    // const headerRow = worksheet.addRow({
    //   name: 'ID',
    //   puesto: 'Puesto',
    //   municipio: 'Municipio',
    //   nombre: 'Nombre',
    // });

    // data.forEach((element) => {
    //   const row = worksheet.addRow({
    //     ID: element.id,
    //     Puesto: element.puesto,
    //     Municipio: element.municipio,
    //     Nombre: element.name,
    //   });
    // });

    // workbook.xlsx.writeBuffer().then((data: any) => {
    //   const blob = new Blob([data], {
    //     type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //   });
    //   const url = window.URL.createObjectURL(blob);
    //   const a = document.createElement('a');
    //   a.href = url;
    //   a.download = 'lista-usuarios.xlsx';
    //   a.click();
    //   window.URL.revokeObjectURL(url);
    // });
  }
}
