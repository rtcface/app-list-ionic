import { Injectable } from '@angular/core';
import { usuario } from '../components/interfaces/usuario';
import { StorageService } from './storage.service';
const STORAGE_KEY = 'app-lista';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private storage: StorageService) {}
  allUsersKeys: string[] | undefined = [];

  gridResult: usuario[] = [];
  async loadGrid() {
    // load data from storage
    this.gridResult = (await this.storage.get(STORAGE_KEY)) || [];
    console.log(this.gridResult);
    return this.gridResult;
  }
}
