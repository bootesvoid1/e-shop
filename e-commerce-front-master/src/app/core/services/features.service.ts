import { Injectable } from '@angular/core';
import { environnement } from '../../../environnemt/environnement';
import { HttpClient } from '@angular/common/http';
import { IFeatures } from '../../common/types/features/features';

@Injectable({
  providedIn: 'root',
})
export class FeaturesService {
  apiUrl = environnement.authApi;
  constructor(private readonly httpClient: HttpClient) {}

  create(payload: IFeatures) {
    return this.httpClient.post(`${this.apiUrl}/product_feature`, payload);
  }
  findAll(page: number = 1, limit: number = 10, query: any = {}) {
    return this.httpClient.post(
      `${this.apiUrl}/product_feature/all?page=${page}&limit=${limit}`,
      query
    );
  }

  findUnpaginated() {
    return this.httpClient.get(`${this.apiUrl}/product_feature`);
  }
  findOne(id: string) {
    return this.httpClient.get(`${this.apiUrl}/product_feature/${id}`);
  }
  update(id: string, payload: Partial<IFeatures>) {
    return this.httpClient.patch(
      `${this.apiUrl}/product_feature/${id}`,
      payload
    );
  }
  delete(id: string) {
    return this.httpClient.delete(`${this.apiUrl}/product_feature/${id}`);
  }
}
