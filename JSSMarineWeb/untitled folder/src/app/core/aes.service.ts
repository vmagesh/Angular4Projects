import { Injectable } from '@angular/core';
import * as aesjs from 'aes-js';

@Injectable({
  providedIn: 'root'
})
export class AesService {
  key = aesjs.utils.utf8.toBytes('abdcff35b9979b151f2136cd13abdc5g');
  iv: any = null;

  encrypt(value: any) {
    let data = this.stringfyData(value);
    var textBytes = aesjs.padding.pkcs7.pad(aesjs.utils.utf8.toBytes(data));
    var aesCbc = new aesjs.ModeOfOperation.cbc(this.key, this.iv);
    var encryptedBytes = aesCbc.encrypt(textBytes);
    var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
    var final = btoa(
      encryptedHex
        .match(/\w{2}/g)
        .map(function(a) {
          return String.fromCharCode(parseInt(a, 16));
        })
        .join('')
    );
    return final;
  }

  decrypt(data: any) {
    var encryptedBytes = Uint8Array.from(atob(data), c => c.charCodeAt(0));
    var aesCbc = new aesjs.ModeOfOperation.cbc(this.key, this.iv);
    var decryptedBytes = aesjs.padding.pkcs7.strip(aesCbc.decrypt(encryptedBytes));
    var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
    return this.parseData(decryptedText);
  }

  private stringfyData(data: any) {
    return JSON.stringify(data);
  }

  private parseData(value: any) {
    return JSON.parse(value);
  }

  constructor() {}
}
