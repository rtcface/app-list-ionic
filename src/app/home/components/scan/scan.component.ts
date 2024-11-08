import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, AlertController } from '@ionic/angular';
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
    if (this.platform.is('capacitor')) {
      BarcodeScanner.isSupported().then();
      BarcodeScanner.checkPermissions().then();
      BarcodeScanner.removeAllListeners();
    }
  }
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

  save = async (data: string) => {
    // data = 'Sesaet002-Javier Tepehua-Gerente-Tlaxcala';

    const scanResultSplit = data.split('-');
    this.usuario.id = scanResultSplit[0];
    this.usuario.name = scanResultSplit[1];
    this.usuario.puesto = scanResultSplit[2];
    this.usuario.municipio = scanResultSplit[3];
    const status = await this.scanservice.checkUser(this.usuario);

    if (status) {
      this.alert(this.scanservice.messageResponse(this.usuario, status));
    } else {
      this.scanservice.saveUser(this.usuario);
      this.alert(this.scanservice.messageResponse(this.usuario, status));
    }
  };
}
