import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { ScanComponent } from './components/scan/scan.component';
import { RegisterComponent } from './components/register/register.component';
import { BarcodeScanningModalComponent } from './components/barcode-scanning-modal/barcode-scanning-modal.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, HomePageRoutingModule],
  declarations: [
    HomePage,
    ScanComponent,
    RegisterComponent,
    BarcodeScanningModalComponent,
  ],
})
export class HomePageModule {}
