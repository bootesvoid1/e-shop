import { Injectable } from '@angular/core';
import { environnement } from '../../../environnemt/environnement';
import { HttpClient } from '@angular/common/http';
import { ISizeVariant } from '../../common/types/product';

@Injectable({
  providedIn: 'root',
})
export class SizeVariantService {
  apiUrl = environnement.authApi;
  constructor(private readonly httpClient: HttpClient) {}

  create(payload: ISizeVariant) {
    return this.httpClient.post(`${this.apiUrl}/size_variant`, payload);
  }
  findAll(page: number = 1, limit: number = 10, query: any = {}) {
    return this.httpClient.post(
      `${this.apiUrl}/size_variant/all?page=${page}&limit=${limit}`,
      query
    );
  }

  findUnpaginated() {
    return this.httpClient.get(`${this.apiUrl}/size_variant`);
  }
  findOne(id: string) {
    return this.httpClient.get(`${this.apiUrl}/size_variant/${id}`);
  }
  update(id: string, payload: Partial<ISizeVariant>) {
    return this.httpClient.patch(`${this.apiUrl}/size_variant/${id}`, payload);
  }
  delete(id: string) {
    return this.httpClient.delete(`${this.apiUrl}/size_variant/${id}`);
  }
}
