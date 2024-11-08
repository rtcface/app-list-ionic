import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { usuario } from '../components/interfaces/usuario';

@Injectable({
  providedIn: 'root',
})
export class ScanService {
  constructor(private storage: StorageService) {}

  messageResponse = (user: usuario, status: boolean) => {
    if (status) {
      return 'El usuario ' + user.name + ' ya existe en la base de datos';
    } else {
      return 'El usuario ' + user.name + ' fue registrado correctamente';
    }
  };

  saveUser({ id, name, puesto, municipio }: usuario) {
    this.storage.set('id', id);
    this.storage.set('name', name);
    this.storage.set('puesto', puesto);
    this.storage.set('municipio', municipio);
  }

  async checkUser({ id, name, puesto, municipio }: usuario): Promise<boolean> {
    const user = await this.storage.get('id');
    const nameUser = await this.storage.get('name');
    const puestoUser = await this.storage.get('puesto');
    const municipioUser = await this.storage.get('municipio');
    if (
      user === id &&
      name === nameUser &&
      puesto === puestoUser &&
      municipio === municipioUser
    ) {
      return true;
    } else {
      return false;
    }
  }
}
