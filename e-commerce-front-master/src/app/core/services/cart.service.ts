import { Injectable } from '@angular/core';
import { environnement } from '../../../environnemt/environnement';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Cartservice {
  apiUrl = environnement.authApi;

  constructor(private readonly httpClient: HttpClient) {}

  create(payload: any) {
    return this.httpClient.post(`${this.apiUrl}/cart`, payload);
  }

  findOne() {
    return this.httpClient.get(`${this.apiUrl}/cart`);
  }

  update(payload: any) {
    return this.httpClient.patch(`${this.apiUrl}/cart`, payload);
  }
}
