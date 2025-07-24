import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { v4 } from 'uuid';
import * as CryptoJS from 'crypto-js';
import { Observable } from 'rxjs';
import { environnement } from '../../../environnemt/environnement';
import { IImageKit } from '../../common/types/image-kit';

@Injectable({ providedIn: 'root' })
export class ImageKitService {
  constructor(private readonly http: HttpClient) {}

  private authenticator() {
    const private_key: string = environnement.privateKey;

    const token: string = v4();
    const expire = Date.now() / 1000 + 2400;
    var data = token + expire;
    var signature = CryptoJS.HmacSHA1(data, private_key).toString(
      CryptoJS.enc.Hex
    );

    return {
      token,
      expire,
      signature,
    };
  }

  upload(file: File): Observable<IImageKit> {
    const formData = new FormData();
    const body = this.authenticator();

    formData.append('file', file);
    formData.append('signature', body.signature || '');
    formData.append('expire', body.expire as any);
    formData.append('token', body.token);
    formData.append('fileName', `${v4()}-${file.name}`);
    formData.append('publicKey', environnement.publicKey);

    const finalUrl = 'https://upload.imagekit.io/api/v1/files/upload';

    return this.http.post<IImageKit>(finalUrl, formData);
  }
}
