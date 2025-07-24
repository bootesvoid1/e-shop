import { Injectable } from '@angular/core';
import { environnement } from '../../../environnemt/environnement';
import { HttpClient } from '@angular/common/http';
import { IManufacturor } from '../../common/types/product';

@Injectable({
  providedIn: 'root',
})
export class ManufacturorService {
  apiUrl = environnement.authApi;
  constructor(private readonly httpClient: HttpClient) {}

  create(payload: IManufacturor) {
    return this.httpClient.post(`${this.apiUrl}/manufacturor`, payload);
  }
  findAll(page: number = 1, limit: number = 10, query: any = {}) {
    return this.httpClient.post(
      `${this.apiUrl}/manufacturor/all?page=${page}&limit=${limit}`,
      query
    );
  }
  findUnpaginated() {
    return this.httpClient.get(`${this.apiUrl}/manufacturor`);
  }
  findOne(id: string) {
    return this.httpClient.get(`${this.apiUrl}/manufacturor/${id}`);
  }
  update(id: string, payload: Partial<IManufacturor>) {
    return this.httpClient.patch(`${this.apiUrl}/manufacturor/${id}`, payload);
  }
  delete(id: string) {
    return this.httpClient.delete(`${this.apiUrl}/manufacturor/${id}`);
  }
}
