import { Injectable } from '@angular/core';
import { environnement } from '../../../environnemt/environnement';
import { HttpClient } from '@angular/common/http';
import { IVariant } from '../../common/types/product';

@Injectable({
  providedIn: 'root',
})
export class VariantService {
  apiUrl = environnement.authApi;
  constructor(private readonly httpClient: HttpClient) {}

  create(payload: IVariant) {
    return this.httpClient.post(`${this.apiUrl}/variants`, payload);
  }
  findAll(page: number = 1, limit: number = 10, query: any = {}) {
    return this.httpClient.post(
      `${this.apiUrl}/variants/all?page=${page}&limit=${limit}`,
      query
    );
  }
  findUnpaginated() {
    return this.httpClient.get(`${this.apiUrl}/variants`);
  }
  findOne(id: string) {
    return this.httpClient.get(`${this.apiUrl}/variants/${id}`);
  }
  update(id: string, payload: Partial<IVariant>) {
    return this.httpClient.patch(`${this.apiUrl}/variants/${id}`, payload);
  }
  delete(id: string) {
    return this.httpClient.delete(`${this.apiUrl}/variants/${id}`);
  }
}
