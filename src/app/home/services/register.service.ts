import { Injectable } from '@angular/core';
import { usuario } from '../components/interfaces/usuario';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private storage: StorageService) {}
  gridResult: usuario[] = [];
  async loadGrid() {
    // load data from storage
    this.gridResult = [
      {
        id: (await this.storage.get('id')) || '',
        name: (await this.storage.get('name')) || '',
        puesto: (await this.storage.get('puesto')) || '',
        municipio: (await this.storage.get('municipio')) || '',
      },
    ];

    return this.gridResult;
  }
}
