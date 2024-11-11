import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

//import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
//import { Drivers } from '@ionic/storage';
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    // const storage = new Storage({
    //   driverOrder: [
    //     CordovaSQLiteDriver._driver,
    //     Drivers.IndexedDB,
    //     Drivers.LocalStorage,
    //   ],
    // });
    // await this.storage.defineDriver(CordovaSQLiteDriver);
    //await this.storage.create();
    this._storage = storage;
  }

  // Create and expose methods that users of this service can
  // call, for example:
  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }
  public get(key: string) {
    return this._storage?.get(key);
  }
  public remove(key: string) {
    this._storage?.remove(key);
  }
  public clear() {
    this._storage?.clear();
  }
  public keys() {
    return this._storage?.keys();
  }
  public length() {
    return this._storage?.length();
  }
}
