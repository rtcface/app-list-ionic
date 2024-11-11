import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { usuario } from '../components/interfaces/usuario';

const STORAGE_KEY = 'app-lista';

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

  async saveUser(user: usuario) {
    const stData = (await this.storage.get(STORAGE_KEY)) || [];
    stData.push(user);
    console.log(stData);
    return this.storage.set(STORAGE_KEY, stData);
  }
  async clearDB() {
    return this.storage.clear();
  }
  async userExist(user: usuario): Promise<boolean> {
    const stData = (await this.storage.get(STORAGE_KEY)) || [];
    console.log(stData);
    const userExist = stData.find((element: usuario) => element.id === user.id);
    return userExist ? true : false;
  }
}
