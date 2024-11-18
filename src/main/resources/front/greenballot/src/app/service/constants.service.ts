import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  readonly developmentAPIHost: string = 'http://localhost:9090/';
  readonly developmentWalletAPIHost: string = 'http://localhost:9090/';
  readonly serverHost: string = '/';
  readonly version: string = '2.2.1';
  readonly developmentMode: boolean = true;



  getAPIUrl() {
    if (this.developmentMode) {
      return this.developmentAPIHost;
    } else {
      return this.serverHost;
    }
  }

  getWalletAPIUrl() {
    if (this.developmentMode) {
      return this.developmentWalletAPIHost;
    } else {
      return this.serverHost;
    }
  }
  constructor() { }
}
