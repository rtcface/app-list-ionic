import { Component, OnInit } from '@angular/core';
import {
  ModalController,
  Platform,
  AlertController,
  AlertInput,
} from '@ionic/angular';
import { BarcodeScanningModalComponent } from '../barcode-scanning-modal/barcode-scanning-modal.component';
import { LensFacing, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { usuario } from '../interfaces/usuario';
import { ScanService } from '../../services/scan.service';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.scss'],
})
export class ScanComponent implements OnInit {
  constructor(
    private modalController: ModalController,
    private platform: Platform,
    private alertController: AlertController,
    private scanservice: ScanService,
  ) {}

  ngOnInit() {
    //this.scanservice.clearDB();
    if (this.platform.is('capacitor')) {
      BarcodeScanner.isSupported().then();
      BarcodeScanner.checkPermissions().then();
      BarcodeScanner.removeAllListeners();
    }
  }

  alertInputs: AlertInput[] = [
    {
      name: 'name',
      placeholder: 'Nombre',
      type: 'text',
    },
    {
      name: 'puesto',
      placeholder: 'Cargo o Comision',
      type: 'text',
    },
    {
      name: 'municipio',
      placeholder: 'Municipio',
      type: 'text',
    },
  ];

  scanResult = 'Sesaet001-Juan Tepehua-Analista de Tecnología-Tlaxcala';
  usuario: usuario = {
    id: '',
    name: '',
    puesto: '',
    municipio: '',
  };
  async startScan() {
    const modal = await this.modalController.create({
      component: BarcodeScanningModalComponent,
      cssClass: 'barcode-scanning-modal',
      showBackdrop: false,
      animated: true,
      componentProps: {
        formats: [],
        lensFacing: LensFacing.Back,
      },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (!data) {
      return;
    }

    console.log(this.scanResult);

    this.scanResult = data?.barcode?.displayValue;
    this.save(this.scanResult);
    modal.dismiss();
  }

  alert = async (message: string) => {
    const alert = await this.alertController.create({
      header: 'Alert',
      message,
      buttons: ['Ok'],
    });
    await alert.present();
  };
  alertNewUser = async (message: string) => {
    const alert = await this.alertController.create({
      header: 'Registrar Asistente',
      message,
      inputs: this.alertInputs,
      buttons: ['Guardar'],
    });
    await alert.present();
    const { data } = await alert.onDidDismiss();
    if (!data) {
      return;
    }
    console.log(data);
    console.log('--->', data.values.name);
    const id = this.createIdIncludeDate();
    const name = data.values.name;
    const puesto = data.values.puesto;
    const municipio = data.values.municipio;
    console.log('-->DelForm', id, name, puesto, municipio);
    if (!name || !puesto || !municipio) {
      return;
    }
    this.save(id + '-' + name + '-' + puesto + '-' + municipio);

    alert.dismiss();
  };

  save = async (data: string) => {
    //data = 'Sesaet003-Javier Tepehua J-Gerente-Tlaxcala';

    const scanResultSplit = data.split('-');
    this.usuario.id = scanResultSplit[0];
    this.usuario.name = scanResultSplit[1];
    this.usuario.puesto = scanResultSplit[2];
    this.usuario.municipio = scanResultSplit[3];
    const status = await this.scanservice.userExist(this.usuario);

    if (status) {
      this.alert(this.scanservice.messageResponse(this.usuario, status));
    } else {
      this.scanservice.saveUser(this.usuario);
      this.alert(this.scanservice.messageResponse(this.usuario, status));
    }
  };

  createIdIncludeDate() {
    const date = new Date();
    const id = date.getTime();
    return id;
  }
}
