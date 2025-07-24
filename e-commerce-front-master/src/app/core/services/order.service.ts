import { Injectable } from '@angular/core';
import { environnement } from '../../../environnemt/environnement';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  apiUrl = environnement.authApi;

  constructor(private readonly httpClient: HttpClient) {}

  create(payload: any) {
    return this.httpClient.post(`${this.apiUrl}/order`, payload);
  }

  findAll(page: number = 1, limit: number = 10, query: any = {}) {
    return this.httpClient.post(
      `${this.apiUrl}/order/all?page=${page}&limit=${limit}`,
      query
    );
  }
  findOne() {
    return this.httpClient.get(`${this.apiUrl}/order`);
  }

  update(payload: any) {
    return this.httpClient.patch(`${this.apiUrl}/order`, payload);
  }
}
