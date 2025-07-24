import { Inject, Injectable } from '@angular/core';
import { environnement } from '../../../environnemt/environnement';
import { ICateogry } from '../../common/types/category/category';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Category {
  apiUrl = environnement.authApi;
  constructor(private readonly httpClient: HttpClient) {}

  create(payload: ICateogry) {
    return this.httpClient.post(`${this.apiUrl}/category`, payload);
  }
  findAll(page: number = 1, limit: number = 10, query: any = {}) {
    return this.httpClient.post(
      `${this.apiUrl}/category/all?page=${page}&limit=${limit}`,
      query
    );
  }
  findUnpaginated() {
    return this.httpClient.get(`${this.apiUrl}/category`);
  }
  findOne(id: string) {
    return this.httpClient.get(`${this.apiUrl}/category/${id}`);
  }
  update(id: string, payload: Partial<ICateogry>) {
    return this.httpClient.patch(`${this.apiUrl}/category/${id}`, payload);
  }
  delete(id: string) {
    return this.httpClient.delete(`${this.apiUrl}/category/${id}`);
  }
}
