import { Injectable } from '@angular/core';
import { environnement } from '../../../environnemt/environnement';
import { HttpClient } from '@angular/common/http';
import { IProduct } from '../../common/types/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  apiUrl = environnement.authApi;
  constructor(private readonly httpClient: HttpClient) {}

  create(payload: IProduct) {
    return this.httpClient.post(`${this.apiUrl}/products`, payload);
  }
  findAll(page: number = 1, limit: number = 10, query: any = {}) {
    return this.httpClient.post(
      `${this.apiUrl}/products/all?page=${page}&limit=${limit}`,
      query
    );
  }
  findOne(id: string) {
    return this.httpClient.get(`${this.apiUrl}/products/${id}`);
  }
  update(id: string, payload: Partial<IProduct>) {
    return this.httpClient.patch(`${this.apiUrl}/products/${id}`, payload);
  }
  delete(id: string) {
    return this.httpClient.delete(`${this.apiUrl}/products/${id}`);
  }
}
